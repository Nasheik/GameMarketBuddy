// const express = require('express');
// const IORedis = require('ioredis');
// const { Queue, Worker } = require('bullmq');
// const { createClient } = require('@supabase/supabase-js');

// const app = express();
// // Middleware to parse JSON request bodies
// app.use(express.json());

// // Middleware to log incoming requests for debugging
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
//   next();
// });


// const redis = new IORedis(process.env.UPSTASH_REDIS_REST_URL, {
//   password: process.env.UPSTASH_REDIS_REST_TOKEN,
//   tls: {}, // Required for Upstash TLS
//   maxRetriesPerRequest: null, // Required by BullMQ
// });
// redis.ping().then(console.log); // Should print "PONG" if connected successfully

// const postQueue = new Queue('postQueue', { connection: redis });

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// new Worker('postQueue', async job => {
//   const { id, content, platform } = job.data;
//     console.log('Job Processing: ', id, content, platform);
// //   try {
// //     if (platform === 'twitter') {
// //       let mediaId = null;

// //       if (video_url) {
// //         // Download video temporarily
// //         const tmpFile = await tmp.file({ postfix: '.mp4' });
// //         const writer = fs.createWriteStream(tmpFile.path);
// //         const response = await axios.get(video_url, { responseType: 'stream' });
// //         response.data.pipe(writer);

// //         await new Promise((resolve, reject) => {
// //           writer.on('finish', resolve);
// //           writer.on('error', reject);
// //         });

// //         const mediaType = 'video/mp4';
// //         const mediaSize = fs.statSync(tmpFile.path).size;

// //         mediaId = await twitterClient.v1.uploadMedia(tmpFile.path, {
// //           type: 'longvideo',
// //         });

// //         await tmpFile.cleanup();
// //       }

// //       const tweet = await twitterClient.v2.tweet({
// //         text: content,
// //         media: mediaId ? { media_ids: [mediaId] } : undefined,
// //       });

// //       console.log(`✅ Tweeted: https://twitter.com/user/status/${tweet.data.id}`);
// //     }
    
// //     else if (platform === 'tiktok') {
// //       if (!video_url) throw new Error('TikTok post missing video_url');

// //       const tiktokAccessToken = process.env.TIKTOK_ACCESS_TOKEN;

// //       const initRes = await axios.post(
// //         'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/',
// //         {
// //           source_info: {
// //             source: 'PULL_FROM_URL',
// //             video_url: video_url
// //           }
// //         },
// //         {
// //           headers: {
// //             'Authorization': `Bearer ${tiktokAccessToken}`,
// //             'Content-Type': 'application/json'
// //           }
// //         }
// //       );

// //       const publishId = initRes.data?.data?.publish_id;
// //       if (!publishId) throw new Error('Failed to retrieve publish_id from TikTok');

// //       console.log(`🎬 TikTok video upload initiated: publish_id = ${publishId}`);
// //       // You could optionally poll for status using the status API here

// //     } else {
// //       console.log(`❌ Unsupported platform: ${platform}`);
// //     }

// //     await supabase
// //       .from('saved_posts')
// //       .update({ status: 'published' })
// //       .eq('id', id);

// //   } catch (error) {
// //     console.error(`❌ Error posting to ${platform}:`, error);
// //     await supabase
// //       .from('saved_posts')
// //       .update({ status: 'failed' })
// //       .eq('id', id);
// //   }

// }, { connection: redis });

// app.listen(3333, () => console.log('🚀 Server running on port 3333'));


export default {
    async fetch(request, env, ctx) {
      const SUPABASE_URL = env.SUPABASE_URL;
      const SUPABASE_KEY = env.SUPABASE_KEY;
  
      const now = new Date().toISOString();
  
      // 1. Fetch all due, unprocessed jobs
      const res = await fetch(`${SUPABASE_URL}/rest/v1/saved_posts?status=eq.scheduled&time_to_post=lte.${now}`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        }
      });
  
      const jobs = await res.json();
  
      // 2. Process jobs
      for (const job of jobs) {
        console.log(`Posting to ${job.platform}:`, job.content);
  
        // 🔁 Your logic: Send to API (e.g., Twitter/TikTok API)
        // await sendToPlatform(job.platform, job.content);
  
        // 3. Mark as processed
        await fetch(`${SUPABASE_URL}/rest/v1/scheduled_posts?id=eq.${job.id}`, {
          method: 'PATCH',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ status: 'published' })
        });
      }
  
      return new Response(`✅ Processed ${jobs.length} job(s)`);
    }
  };
  
  