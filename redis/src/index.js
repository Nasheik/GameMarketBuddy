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
    // const supa2 = process.env.SUPABASE_URL;
  
    const now = new Date().toISOString();

    console.log(SUPABASE_URL, now);
    console.log("sup2", supa2);
  
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
      await fetch(`${SUPABASE_URL}/rest/v1/saved_posts?id=eq.${job.id}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'published' })
      });
    }
  
    console.log(`✅ Processed ${jobs.length} job(s)`);
  }
  
  
  