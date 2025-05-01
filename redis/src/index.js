export default {
    async scheduled(controller, env, ctx) {
        ctx.waitUntil(processJobs(env));
        console.log("cron processed");
    },
};

async function processJobs(env) {
    console.log("cron processed");
}