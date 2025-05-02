// Source: Enhanced from https://github.com/austin-mc/TwitterWorker/blob/main/index.js
//Used for twitter api auth
import { HmacSHA1, enc } from "crypto-js";
import OAuth from "oauth-1.0a";

addEventListener("scheduled", (event) => {
   event.waitUntil(processJobs(event));
});

// From OAuth-1.0a docs
const oauth = new OAuth({
   consumer: { key: TWITTER_API_KEY, secret: TWITTER_API_SECRET },
   signature_method: "HMAC-SHA1",
   hash_function: hashSha1,
});

// Hash function for OAuth using Crypto-JS HMAC-SHA1
function hashSha1(baseString, key) {
   return HmacSHA1(baseString, key).toString(enc.Base64);
}

// Will be added to request headers
const token = {
   key: TWITTER_ACCESS_TOKEN,
   secret: TWITTER_ACCESS_SECRET,
};

// Constants for media handling
const CLOUDFLARE_DOMAIN = CLOUDFLARE_PUBLIC_DOMAIN;

async function processJobs(event) {
   const SUPABASE_URL = NEXT_PUBLIC_SUPABASE_URL;
   const SUPABASE_KEY = SUPABASE_SERVICE_ROLE_KEY;
   const SUPABASE_ANON_KEY = NEXT_PUBLIC_SUPABASE_ANON_KEY;

   const now = new Date().toISOString();

   // 1. Fetch all due, unprocessed jobs
   const res = await fetch(
      `${SUPABASE_URL}/rest/v1/saved_posts?status=eq.scheduled&time_to_post=lte.${now}`,
      {
         headers: {
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
         },
      }
   );

   const jobs = await res.json();
   console.log(`${jobs.length} job(s)`);

   // 2. Process jobs
   for (const job of jobs) {
      console.log(`Posting to ${job.platform}:`, job.content);

      // Process the job based on the platform
      let isSuccess = false;
      if (job.platform === "twitter") {
         // Build the R2 key from media_url, if present
         const mediaR2Key = job.media_url ? job.media_url : null;
         isSuccess = await sendToTwitter(job.content, mediaR2Key);
      } else if (job.platform === "tiktok")
         isSuccess = await sendToTikTok(job.content);
      else console.log(`❌ Unsupported platform: ${job.platform}`);
      const newStatus = isSuccess ? "published" : "failed";

      // 3. Mark as processed
      await fetch(`${SUPABASE_URL}/rest/v1/saved_posts?id=eq.${job.id}`, {
         method: "PATCH",
         headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify({ status: newStatus }),
      });
   }

   console.log(`✅ Processed ${jobs.length} job(s)`);
}

async function sendToTwitter(content, mediaR2Key) {
   console.log("Sending to Twitter: ", content);

   try {
      // If we have a media key, process it first
      let mediaId = null;

      if (mediaR2Key) {
         console.log(`Processing media from R2: ${mediaR2Key}`);
         mediaId = await uploadTwitterMedia(mediaR2Key);

         if (!mediaId) {
            throw new Error("Failed to upload media to Twitter");
         }

         console.log(
            `Successfully uploaded media to Twitter with ID: ${mediaId}`
         );
      }

      // Now post the tweet, with media attachment if available
      const tweetUrl = "https://api.twitter.com/2/tweets";
      const tweetAuth = {
         url: tweetUrl,
         method: "POST",
      };

      const tweetBody = {
         text: content,
      };

      // Attach media ID if we have one
      if (mediaId) {
         tweetBody.media = {
            media_ids: [mediaId],
         };
      }

      const res = await fetch(tweetUrl, {
         method: "POST",
         headers: {
            ...oauth.toHeader(oauth.authorize(tweetAuth, token)),
            "Content-Type": "application/json",
         },
         body: JSON.stringify(tweetBody),
      });

      if (!res.ok) {
         const errorText = await res.text();
         throw new Error(
            `Twitter API error: ${res.status} ${res.statusText} - ${errorText}`
         );
      }

      const data = await res.json();
      console.log("Twitter response: ", JSON.stringify(data, null, 2));

      return true; // Indicate success
   } catch (error) {
      console.error("❌ Error posting to Twitter:", error);
      return false; // Indicate failure
   }
}

async function uploadTwitterMedia(mediaUrl) {
   try {
      if (!mediaUrl) {
         throw new Error("No media URL provided");
      }

      console.log(`Fetching media from path: ${mediaUrl}`);

      // Get the full URL using the CLOUDFLARE_PUBLIC_DOMAIN environment variable
      const mediaFullUrl = `${CLOUDFLARE_PUBLIC_DOMAIN}${mediaUrl}`;
      console.log(`Full media URL: ${mediaFullUrl}`);

      // Fetch the media file
      const mediaResponse = await fetch(mediaFullUrl);

      if (!mediaResponse.ok) {
         throw new Error(
            `Failed to fetch media: ${mediaResponse.status} ${mediaResponse.statusText}`
         );
      }

      // Get the file content as a buffer
      const fileBuffer = await mediaResponse.arrayBuffer();
      const fileBlob = new Blob([fileBuffer]);

      // Determine content type from file extension or default to video/mp4
      const fileExtension = mediaUrl.split(".").pop().toLowerCase();
      let contentType = "video/mp4"; // Default

      if (fileExtension === "mov") contentType = "video/quicktime";
      else if (fileExtension === "avi") contentType = "video/x-msvideo";
      else if (fileExtension === "webm") contentType = "video/webm";
      else if (fileExtension === "jpg" || fileExtension === "jpeg")
         contentType = "image/jpeg";
      else if (fileExtension === "png") contentType = "image/png";
      else if (fileExtension === "gif") contentType = "image/gif";

      // Step 1: Initialize the upload
      const initUrl = "https://upload.twitter.com/1.1/media/upload.json";
      const initParams = new URLSearchParams({
         command: "INIT",
         total_bytes: fileBlob.size,
         media_type: contentType,
      });

      const initAuth = {
         url: `${initUrl}?${initParams.toString()}`,
         method: "POST",
      };

      const initRes = await fetch(`${initUrl}?${initParams.toString()}`, {
         method: "POST",
         headers: oauth.toHeader(oauth.authorize(initAuth, token)),
      });

      if (!initRes.ok) {
         const errorText = await initRes.text();
         throw new Error(
            `Twitter INIT error: ${initRes.status} ${initRes.statusText} - ${errorText}`
         );
      }

      const initData = await initRes.json();
      const mediaId = initData.media_id_string;
      console.log(`Media upload initialized with ID: ${mediaId}`);

      // Step 2: Upload the media in chunks
      const chunkSize = 1024 * 1024; // 1MB chunks
      const totalChunks = Math.ceil(fileBlob.size / chunkSize);

      for (let segment = 0; segment < totalChunks; segment++) {
         const start = segment * chunkSize;
         const end = Math.min(start + chunkSize, fileBlob.size);
         const chunk = fileBlob.slice(start, end);

         const formData = new FormData();
         formData.append("command", "APPEND");
         formData.append("media_id", mediaId);
         formData.append("segment_index", segment);
         formData.append("media", chunk);

         const appendUrl = "https://upload.twitter.com/1.1/media/upload.json";
         const appendAuth = {
            url: appendUrl,
            method: "POST",
         };

         const appendRes = await fetch(appendUrl, {
            method: "POST",
            headers: {
               ...oauth.toHeader(oauth.authorize(appendAuth, token)),
               // Note: Don't set Content-Type for FormData
            },
            body: formData,
         });

         if (!appendRes.ok) {
            const errorText = await appendRes.text();
            throw new Error(
               `Twitter APPEND error: ${appendRes.status} ${appendRes.statusText} - ${errorText}`
            );
         }

         console.log(`Uploaded chunk ${segment + 1}/${totalChunks}`);
      }

      // Step 3: Finalize the upload
      const finalizeUrl = "https://upload.twitter.com/1.1/media/upload.json";
      const finalizeParams = new URLSearchParams({
         command: "FINALIZE",
         media_id: mediaId,
      });

      const finalizeAuth = {
         url: `${finalizeUrl}?${finalizeParams.toString()}`,
         method: "POST",
      };

      const finalizeRes = await fetch(
         `${finalizeUrl}?${finalizeParams.toString()}`,
         {
            method: "POST",
            headers: oauth.toHeader(oauth.authorize(finalizeAuth, token)),
         }
      );

      if (!finalizeRes.ok) {
         const errorText = await finalizeRes.text();
         throw new Error(
            `Twitter FINALIZE error: ${finalizeRes.status} ${finalizeRes.statusText} - ${errorText}`
         );
      }

      const finalizeData = await finalizeRes.json();
      console.log("Media upload finalized:", finalizeData);

      // Step 4: Check processing status for videos (optional but recommended)
      if (contentType.startsWith("video/")) {
         await checkMediaProcessingStatus(mediaId);
      }

      return mediaId;
   } catch (error) {
      console.error("Error uploading media to Twitter:", error);
      return null;
   }
}

async function checkMediaProcessingStatus(mediaId) {
   const maxAttempts = 10;
   let attempts = 0;
   let processing = true;

   while (processing && attempts < maxAttempts) {
      const statusUrl = "https://upload.twitter.com/1.1/media/upload.json";
      const statusParams = new URLSearchParams({
         command: "STATUS",
         media_id: mediaId,
      });

      const statusAuth = {
         url: `${statusUrl}?${statusParams.toString()}`,
         method: "GET",
      };

      const statusRes = await fetch(`${statusUrl}?${statusParams.toString()}`, {
         method: "GET",
         headers: oauth.toHeader(oauth.authorize(statusAuth, token)),
      });

      if (!statusRes.ok) {
         throw new Error(
            `Twitter STATUS error: ${statusRes.status} ${statusRes.statusText}`
         );
      }

      const statusData = await statusRes.json();
      console.log("Media status:", statusData.processing_info?.state);

      if (
         !statusData.processing_info ||
         statusData.processing_info.state === "succeeded"
      ) {
         processing = false;
      } else if (statusData.processing_info.state === "failed") {
         throw new Error(
            `Media processing failed: ${statusData.processing_info.error?.message}`
         );
      } else {
         // Wait before checking again
         const waitTime =
            statusData.processing_info.check_after_secs * 1000 || 5000;
         await new Promise((resolve) => setTimeout(resolve, waitTime));
      }

      attempts++;
   }

   if (processing) {
      throw new Error("Media processing timed out");
   }

   console.log("Media processing completed successfully");
}

async function sendToTikTok(content) {
   console.log("Sending to TikTok: ", content);
   try {
      const tiktokAccessToken = TIKTOK_ACCESS_TOKEN;

      const initRes = await axios.post(
         "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/",
         {
            source_info: {
               source: "PULL_FROM_URL",
               video_url: content.video_url,
            },
         },
         {
            headers: {
               Authorization: `Bearer ${tiktokAccessToken}`,
               "Content-Type": "application/json",
            },
         }
      );

      const publishId = initRes.data?.data?.publish_id;
      if (!publishId)
         throw new Error("Failed to retrieve publish_id from TikTok");

      console.log(
         `🎬 TikTok video upload initiated: publish_id = ${publishId}`
      );
   } catch (error) {
      console.error("❌ Error posting to TikTok:", error);
   }
}
