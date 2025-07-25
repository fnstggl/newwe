
-- Add is_canceled column to profiles table
ALTER TABLE public.profiles ADD COLUMN is_canceled BOOLEAN DEFAULT false;
