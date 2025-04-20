-- Add stripe_customer_id column to users table
-- Step 1: Add the column (nullable for now) with default
ALTER TABLE public.saved_posts
ADD COLUMN IF NOT EXISTS status VARCHAR(10) DEFAULT 'draft';

-- Step 2: Add the CHECK constraint separately
ALTER TABLE public.saved_posts
ADD CONSTRAINT saved_posts_status_check 
CHECK (status IN ('draft', 'scheduled', 'posted'));

-- Step 3: Set all existing NULLs to default value (just in case)
UPDATE public.saved_posts
SET status = 'draft'
WHERE status IS NULL;

-- Step 4: Alter column to NOT NULL
ALTER TABLE public.saved_posts
ALTER COLUMN status SET NOT NULL;

-- -- Add comment to column
-- COMMENT ON COLUMN public.saved_posts.status IS 'Status of the saved post (draft, scheduled, posted)';