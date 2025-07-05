
-- Create a table for tour requests
CREATE TABLE public.requested_tours (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  date_1 TIMESTAMP WITH TIME ZONE,
  date_2 TIMESTAMP WITH TIME ZONE,
  date_3 TIMESTAMP WITH TIME ZONE,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  property_address TEXT
);

-- Add Row Level Security (RLS) to ensure users can see their own tour requests
ALTER TABLE public.requested_tours ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own tour requests
CREATE POLICY "Users can view their own tour requests" 
  ON public.requested_tours 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own tour requests
CREATE POLICY "Users can create tour requests" 
  ON public.requested_tours 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_requested_tours_user_id ON public.requested_tours(user_id);
CREATE INDEX idx_requested_tours_property ON public.requested_tours(property_id);
