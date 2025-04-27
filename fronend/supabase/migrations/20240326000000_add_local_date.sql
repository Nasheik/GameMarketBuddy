-- Add local_date column to saved_posts table
ALTER TABLE public.saved_posts
ADD COLUMN IF NOT EXISTS local_date DATE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS saved_posts_local_date_idx ON public.saved_posts(local_date);

-- Add comment to column
COMMENT ON COLUMN public.saved_posts.local_date IS 'The local date when the post should be published, used for week schedule constraints';

-- Update the handle_post_scheduling function to include local_date
CREATE OR REPLACE FUNCTION public.handle_post_scheduling()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'http://host.docker.internal:54321/functions/v1/schedule-post';
  payload JSONB;
  response http_response;
BEGIN
  -- Only trigger on status change to 'scheduled' or post_date/post_time change when status is 'scheduled'
  IF (NEW.status = 'scheduled' AND (
    OLD.status != 'scheduled' OR 
    OLD.post_date != NEW.post_date OR 
    OLD.post_time != NEW.post_time
  )) THEN
    -- Prepare the payload
    payload := jsonb_build_object(
      'post_id', NEW.id,
      'user_id', NEW.user_id,
      'game_id', NEW.game_id,
      'post_date', NEW.post_date,
      'post_time', NEW.post_time,
      'local_date', NEW.local_date,
      'platform', NEW.platform,
      'content', NEW.content,
      'media_url', NEW.media_url,
      'media_type', NEW.media_type
    );

    -- Call the webhook
    SELECT * INTO response FROM http((
      'POST',
      webhook_url,
      ARRAY[http_header('Content-Type', 'application/json')],
      'application/json',
      payload::text
    )::http_request);

    -- Log the response for debugging
    RAISE NOTICE 'Webhook response: %', response;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 