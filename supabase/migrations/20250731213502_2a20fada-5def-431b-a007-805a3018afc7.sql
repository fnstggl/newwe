
-- Add new columns to profiles table for user preferences
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS search_duration TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS frustrations TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS searching_for TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS property_type TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bedrooms INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS max_budget INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_neighborhoods TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS must_haves TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS discount_threshold INTEGER;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMP WITH TIME ZONE;
