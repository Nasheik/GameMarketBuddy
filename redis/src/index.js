// Source: https://github.com/austin-mc/TwitterWorker/blob/main/index.js
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

// Will be added to request headers
const reqAuth = {
   url: "https://api.twitter.com/2/tweets",
   method: "POST",
};

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
      if (job.platform === "twitter")
         isSuccess = await sendToTwitter(job.content);
      else if (job.platform === "tiktok")
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

async function sendToTwitter(content) {
   console.log("Sending to Twitter: ", content);

   try {
      const url = "https://api.twitter.com/2/tweets";
      var reqBody = JSON.stringify({
         text: content,
      });

      const res = await fetch(url, {
         method: "POST",
         headers: {
            ...oauth.toHeader(oauth.authorize(reqAuth, token)),
            "Content-Type": "application/json",
         },
         body: reqBody,
      });

      if (!res.ok) {
         throw new Error(`Twitter API error: ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Twitter response: ", JSON.stringify(data, null, 2));

      return true; // Indicate success
   } catch (error) {
      console.error("❌ Error posting to Twitter:", error);
      return false; // Indicate failure
   }
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
