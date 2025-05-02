export default {
   async scheduled(controller, env, ctx) {
      ctx.waitUntil(processJobs(env));
      console.log("cron processed");
   },
};

// async function processJobs(env) {
//     console.log("cron processed");
// }

async function processJobs(env) {
   const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
   const SUPABASE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
   const SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   // const supa2 = process.env.SUPABASE_URL;

   const now = new Date().toISOString();

   console.log(SUPABASE_URL, now);
   // console.log("sup2", supa2);

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
   console.log("jobs", jobs);
   console.log(`${jobs.length} job(s)`);

   // 2. Process jobs
   for (const job of jobs) {
      console.log(`Posting to ${job.platform}:`, job.content);

      // Process the job based on the platform
      let isSuccess = false;
      if (job.platform === "twitter")
         isSuccess = sendToTwitter(env, job.content);
      else if (job.platform === "tiktok") isSuccess = sendToTikTok(job.content);
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

async function sendToTwitter(env, content) {
   console.log("Sending to Twitter: ", content);
   try {
      const url = "https://api.twitter.com/2/tweets";
      const twitterAccessToken = env.TWITTER_ACCESS_TOKEN;

      const res = await fetch(url, {
         method: "POST",
         headers: {
            Authorization: `Bearer ${twitterAccessToken}`,
            "Content-Type": "application/json",
         },
         body: JSON.stringify(tweet),
      });

      if (!res.ok) {
         // console.log("Twitter response: ", res.text);
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
      const tiktokAccessToken = process.env.TIKTOK_ACCESS_TOKEN;

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

// async function sendToPlatform(platform, content) {
//    console.log("Job Processing: ", id, content, platform);
//    try {
//       if (platform === "twitter") {
//          let mediaId = null;

//          if (video_url) {
//             // Download video temporarily
//             const tmpFile = await tmp.file({ postfix: ".mp4" });
//             const writer = fs.createWriteStream(tmpFile.path);
//             const response = await axios.get(video_url, {
//                responseType: "stream",
//             });
//             response.data.pipe(writer);

//             await new Promise((resolve, reject) => {
//                writer.on("finish", resolve);
//                writer.on("error", reject);
//             });

//             const mediaType = "video/mp4";
//             const mediaSize = fs.statSync(tmpFile.path).size;

//             mediaId = await twitterClient.v1.uploadMedia(tmpFile.path, {
//                type: "longvideo",
//             });

//             await tmpFile.cleanup();
//          }

//          const tweet = await twitterClient.v2.tweet({
//             text: content,
//             media: mediaId ? { media_ids: [mediaId] } : undefined,
//          });

//          console.log(
//             `✅ Tweeted: https://twitter.com/user/status/${tweet.data.id}`
//          );
//       } else if (platform === "tiktok") {
//          if (!video_url) throw new Error("TikTok post missing video_url");

//          const tiktokAccessToken = process.env.TIKTOK_ACCESS_TOKEN;

//          const initRes = await axios.post(
//             "https://open.tiktokapis.com/v2/post/publish/inbox/video/init/",
//             {
//                source_info: {
//                   source: "PULL_FROM_URL",
//                   video_url: video_url,
//                },
//             },
//             {
//                headers: {
//                   Authorization: `Bearer ${tiktokAccessToken}`,
//                   "Content-Type": "application/json",
//                },
//             }
//          );

//          const publishId = initRes.data?.data?.publish_id;
//          if (!publishId)
//             throw new Error("Failed to retrieve publish_id from TikTok");

//          console.log(
//             `🎬 TikTok video upload initiated: publish_id = ${publishId}`
//          );
//          // You could optionally poll for status using the status API here
//       } else {
//          console.log(`❌ Unsupported platform: ${platform}`);
//       }

//       await supabase
//          .from("saved_posts")
//          .update({ status: "published" })
//          .eq("id", id);
//    } catch (error) {
//       console.error(`❌ Error posting to ${platform}:`, error);
//       await supabase
//          .from("saved_posts")
//          .update({ status: "failed" })
//          .eq("id", id);
//    }
// }
