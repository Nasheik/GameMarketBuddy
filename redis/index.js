// index.js
require('dotenv').config();
const express = require('express');
const IORedis = require('ioredis');
const { Queue, Worker } = require('bullmq');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());

const redis = new IORedis({ maxRetriesPerRequest: null });
const postQueue = new Queue('postQueue', { connection: redis });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Enqueue route
app.post('/enqueue', async (req, res) => {
  const { id } = req.body;
  console.log('Job Enqueuing:');

  const { data: post, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) return res.status(404).send('Post not found');

  console.log('Post found:', post);

  const delayMs = new Date(post.scheduled_time) - new Date();

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
    .from('posts')
    .update({ status: 'posted' })
    .eq('id', id);

}, { connection: redis });

app.listen(3333, () => console.log('🚀 Server and worker running on port 3333'));
