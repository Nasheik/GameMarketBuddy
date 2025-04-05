const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();


const redis = new IORedis();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const worker = new Worker('postQueue', async job => {
  const { id, content, platform } = job.data;

  // Simulate posting
  console.log(`📣 Posting to ${platform}: ${content}`);

  // Update status in Supabase
  await supabase
    .from('posts')
    .update({ status: 'posted', posted_at: new Date().toISOString() })
    .eq('id', id);
}, { connection: redis });

worker.on('failed', async (job, err) => {
  console.error('❌ Job failed:', err.message);
  await supabase
    .from('posts')
    .update({ status: 'failed' })
    .eq('id', job.data.id);
});
