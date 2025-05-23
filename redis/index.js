// npm install dotenv express ioredis bullmq @supabase/supabase-js twitter-api-v2 axios

// index.js
require('dotenv').config();
const express = require('express');
const IORedis = require('ioredis');
const { Queue, Worker } = require('bullmq');
const { createClient } = require('@supabase/supabase-js');

const app = express();
// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`, req.body);
  next();
});

// const { Redis } = require('@upstash/redis')

// const redis = new Redis({
//   url: 'https://flexible-doe-25466.upstash.io',
//   token: 'AWN6AAIjcDE1M2JmMzU4ZWQzN2U0MGYyOWJjYWI4OTJjMDNhNjMwYnAxMA',
// })


const redis = new IORedis(process.env.UPSTASH_REDIS_REST_URL, {
  password: process.env.UPSTASH_REDIS_REST_TOKEN,
  tls: {}, // Required for Upstash TLS
  maxRetriesPerRequest: null, // Required by BullMQ
});
redis.ping().then(console.log); // Should print "PONG" if connected successfully

const postQueue = new Queue('postQueue', { connection: redis });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Enqueue route
app.post('/enqueue', async (req, res) => {
  const { post_id, content, platform, time_to_post } = req.body;
  console.log('Job Enqueuing: ', post_id);
  if (!post_id) return res.status(400).send('ID is required');


  const delayMs = time_to_post ? new Date(time_to_post) - Date.now() : 0;
  if (delayMs < 0) {
    console.log('Scheduled time is in the past:', time_to_post);
    return res.status(400).send('Scheduled time is in the past');
  }

  await postQueue.add('postToSocialMedia', {
    id: post_id,
    content: content,
    platform: platform
  }, {
    delay: delayMs
  });

  console.log('Job Enqueued!');
  res.send('Job scheduled');
});

const { TwitterApi } = require('twitter-api-v2');
const axios = require('axios');
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Worker
new Worker('postQueue', async job => {
  const { id, content, platform, video_url } = job.data;

  try {
    if (platform === 'twitter') {
      let mediaId = null;

      if (video_url) {
        // Download video temporarily
        const tmpFile = await tmp.file({ postfix: '.mp4' });
        const writer = fs.createWriteStream(tmpFile.path);
        const response = await axios.get(video_url, { responseType: 'stream' });
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        const mediaType = 'video/mp4';
        const mediaSize = fs.statSync(tmpFile.path).size;

        mediaId = await twitterClient.v1.uploadMedia(tmpFile.path, {
          type: 'longvideo',
        });

        await tmpFile.cleanup();
      }

      const tweet = await twitterClient.v2.tweet({
        text: content,
        media: mediaId ? { media_ids: [mediaId] } : undefined,
      });

      console.log(`✅ Tweeted: https://twitter.com/user/status/${tweet.data.id}`);
    }
    
    else if (platform === 'tiktok') {
      if (!video_url) throw new Error('TikTok post missing video_url');

      const tiktokAccessToken = process.env.TIKTOK_ACCESS_TOKEN;

      const initRes = await axios.post(
        'https://open.tiktokapis.com/v2/post/publish/inbox/video/init/',
        {
          source_info: {
            source: 'PULL_FROM_URL',
            video_url: video_url
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${tiktokAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const publishId = initRes.data?.data?.publish_id;
      if (!publishId) throw new Error('Failed to retrieve publish_id from TikTok');

      console.log(`🎬 TikTok video upload initiated: publish_id = ${publishId}`);
      // You could optionally poll for status using the status API here

    } else {
      console.log(`❌ Unsupported platform: ${platform}`);
    }

    await supabase
      .from('saved_posts')
      .update({ status: 'published' })
      .eq('id', id);

  } catch (error) {
    console.error(`❌ Error posting to ${platform}:`, error);
    await supabase
      .from('saved_posts')
      .update({ status: 'failed' })
      .eq('id', id);
  }

}, { connection: redis });

app.listen(3333, () => console.log('🚀 Server running on port 3333'));
