-- Remove day_of_week and best_time columns from saved_posts table
ALTER TABLE public.saved_posts
DROP COLUMN IF EXISTS day_of_week,
DROP COLUMN IF EXISTS best_time;

-- Drop the index for day_of_week since we're removing the column
DROP INDEX IF EXISTS idx_saved_posts_day_of_week; 