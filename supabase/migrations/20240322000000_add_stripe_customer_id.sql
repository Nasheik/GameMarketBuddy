-- Add stripe_customer_id column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS users_stripe_customer_id_idx ON public.users(stripe_customer_id);

-- Add comment to column
COMMENT ON COLUMN public.users.stripe_customer_id IS 'Stripe customer ID associated with this user'; 