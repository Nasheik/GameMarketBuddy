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


app.listen(3333, () => console.log('🚀 Server running on port 3333'));