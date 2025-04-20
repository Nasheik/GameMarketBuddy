-- create or replace function notify_new_post()
-- returns trigger as $$
-- begin
--   RAISE NOTICE 'Calling edge function for post ID: %', NEW.id;

--   perform net.http_post(
--     url := 'http://host.docker.internal:54321/functions/v1/schedule-post',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer YOUR_SUPABASE_SERVICE_ROLE_KEY'
--     ),
--     body := jsonb_build_object('id', NEW.id)
--   );

--   return NEW;
-- end;
-- $$ language plpgsql;


create trigger "my_webhook" after insert
on "public"."saved_post" for each row
execute function "schedule_post"."http_request"(
  'http://host.docker.internal:54321/functions/v1/schedule-post',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);