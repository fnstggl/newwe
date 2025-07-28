
-- Add 'staff' as a valid subscription plan option
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_subscription_plan_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_subscription_plan_check 
CHECK (subscription_plan IN ('free', 'unlimited', 'staff'));
