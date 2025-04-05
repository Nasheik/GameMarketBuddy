// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

console.log("Hello from Functions!");

Deno.serve(async (req) => {
  const body = await req.json();
  console.log("[Debug] Raw body:", body);
  const id = body.record.id;
  console.log("[Info] Received id:", id);

  const jobPayload = {
    id,
    // optionally fetch post data here
  };

  // Send job to your external job server
  try {
    const response = await fetch("http://host.docker.internal:3333/enqueue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jobPayload),
    });

    console.log("[Success] Webhook response:", await response.text());
  } catch (error) {
    console.error(
      "[Fetch Error]",
      error instanceof Error ? error.message : "An unknown error occurred",
    );
  }

  return new Response("Job enqueued");
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/schedule-post' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
