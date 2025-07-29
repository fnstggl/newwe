
-- Update the subscription_plan check constraint to include open_door_plan
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;

ALTER TABLE public.profiles 
ADD CONSTRAINT profiles_subscription_plan_check 
CHECK (subscription_plan IN ('free', 'unlimited', 'manual_unlimited', 'open_door_plan'));
