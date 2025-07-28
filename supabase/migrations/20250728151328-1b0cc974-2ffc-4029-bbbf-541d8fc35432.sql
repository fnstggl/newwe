
-- Add manual_unlimited column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN manual_unlimited boolean NOT NULL DEFAULT false;
