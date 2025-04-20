-- Add time_to_post, media_url, and status columns to saved_posts table
ALTER TABLE public.saved_posts
ADD COLUMN IF NOT EXISTS time_to_post TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS media_url TEXT,
ADD COLUMN IF NOT EXISTS media_type TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed'));

-- Create index for faster lookups on time_to_post
CREATE INDEX IF NOT EXISTS saved_posts_time_to_post_idx ON public.saved_posts(time_to_post);

-- Add comments to columns
COMMENT ON COLUMN public.saved_posts.time_to_post IS 'Scheduled time for the post to be published';
COMMENT ON COLUMN public.saved_posts.media_url IS 'URL of the media file (image or video) associated with the post';
COMMENT ON COLUMN public.saved_posts.media_type IS 'Type of media (image or video)';
COMMENT ON COLUMN public.saved_posts.status IS 'Status of the post (draft, scheduled, published, failed)';

-- Enable the http extension
CREATE EXTENSION IF NOT EXISTS http WITH SCHEMA extensions;

-- Create function to call the schedule-post webhook
CREATE OR REPLACE FUNCTION public.handle_post_scheduling()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT := 'http://host.docker.internal:54321/functions/v1/schedule-post';
  payload JSONB;
  response http_response;
BEGIN
  -- Only trigger on status change to 'scheduled' or time_to_post change when status is 'scheduled'
  IF (NEW.status = 'scheduled' AND (OLD.status != 'scheduled' OR OLD.time_to_post != NEW.time_to_post)) THEN
    -- Prepare the payload
    payload := jsonb_build_object(
      'post_id', NEW.id,
      'user_id', NEW.user_id,
      'game_id', NEW.game_id,
      'time_to_post', NEW.time_to_post,
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

-- Create trigger for post scheduling
CREATE TRIGGER on_post_scheduled
    AFTER UPDATE ON public.saved_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_post_scheduling(); 