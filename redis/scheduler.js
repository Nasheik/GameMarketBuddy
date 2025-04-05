const { createClient } = require('@supabase/supabase-js');
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
require('dotenv').config();


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const redis = new IORedis(); // connects to Docker Redis (localhost:6379)
const postQueue = new Queue('postQueue', { connection: redis });

async function schedulePosts() {
  const now = new Date().toISOString();

  // 1. Query Supabase for scheduled posts
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .lte('scheduled_time', now)
    .eq('status', 'scheduled');

  if (error) {
    console.error('Error fetching posts:', error);
    return;
  }

  for (const post of posts) {
    // 2. Add post to the queue
    await postQueue.add('postToSocialMedia', {
      id: post.id,
      content: post.content,
      platform: post.platform
    });

    // 3. Optionally mark as "queued"
    await supabase
      .from('posts')
      .update({ status: 'queued' })
      .eq('id', post.id);
  }
}

// Poll every 10 seconds
setInterval(schedulePosts, 10000);
