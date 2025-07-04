
-- Add stripe_customer_id column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN stripe_customer_id TEXT;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS profiles_stripe_customer_id_idx ON public.profiles(stripe_customer_id);
