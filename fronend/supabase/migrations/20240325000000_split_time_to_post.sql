-- Split time_to_post into post_date and post_time columns
ALTER TABLE public.saved_posts
ADD COLUMN IF NOT EXISTS post_date DATE,
ADD COLUMN IF NOT EXISTS post_time TIME;

-- Migrate existing data
UPDATE public.saved_posts
SET 
    post_date = time_to_post::date,
    post_time = time_to_post::time
WHERE time_to_post IS NOT NULL;

-- Drop the old column and its index
DROP INDEX IF EXISTS saved_posts_time_to_post_idx;
ALTER TABLE public.saved_posts
DROP COLUMN IF EXISTS time_to_post;

-- Create new indexes for better query performance
CREATE INDEX IF NOT EXISTS saved_posts_post_date_idx ON public.saved_posts(post_date);
CREATE INDEX IF NOT EXISTS saved_posts_post_time_idx ON public.saved_posts(post_time);

-- Add comments to columns
COMMENT ON COLUMN public.saved_posts.post_date IS 'The date when the post should be published';
COMMENT ON COLUMN public.saved_posts.post_time IS 'The time when the post should be published'; 