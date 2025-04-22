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

const redis = new IORedis({ maxRetriesPerRequest: null });
const postQueue = new Queue('postQueue', { connection: redis });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
// const supabase = createClient("http://127.0.0.1:54321", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0");

// Enqueue route
app.post('/enqueue', async (req, res) => {
  const { post_id } = req.body;
  console.log('Job Enqueuing: ', post_id);
  if (!post_id) return res.status(400).send('ID is required');

  const { data: post, error } = await supabase
    .from('saved_posts')
    .select('*')
    .eq('id', post_id)
    .single();

  if(error) {
    console.error('Error fetching post:', error);
    return res.status(500).send('Error fetching post');
  }

  if (error || !post) return res.status(404).send('Post not found');

  console.log('Post found:', post);

  // if(post.status !== 'scheduled') {
  //   return res.status(400).send('Post is not scheduled');
  // }
  // console.log((post.time_to_post))
  // console.log((post.time_to_post).getTime())
  // console.log(new Date(post.time_to_post).getTime())+().getTime())

  const delayMs = post.time_to_post ? new Date(post.time_to_post) - Date.now() : 0;
  if (delayMs < 0) {
    console.log('Scheduled time is in the past:', post.time_to_post);
    return res.status(400).send('Scheduled time is in the past');
  }

  await postQueue.add('postToSocialMedia', {
    id: post.id,
    content: post.content,
    platform: post.platform
  }, {
    delay: delayMs
  });

  console.log('Job Enqueued!');
  res.send('Job scheduled');
});

// Worker
new Worker('postQueue', async job => {
  const { id, content, platform } = job.data;

  console.log(`📣 Posting to ${platform}: ${content}`);

  await supabase
    .from('saved_posts')
    .update({ status: 'posted' })
    .eq('id', id);

}, { connection: redis });

app.listen(3333, () => console.log('🚀 Server and worker running on port 3333'));
