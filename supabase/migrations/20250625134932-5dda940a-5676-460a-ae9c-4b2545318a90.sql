
-- Create a table for saved properties
CREATE TABLE public.saved_properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  property_id UUID NOT NULL,
  property_type TEXT NOT NULL CHECK (property_type IN ('sale', 'rental')),
  saved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, property_id, property_type)
);

-- Add Row Level Security (RLS) to ensure users can only see their own saved properties
ALTER TABLE public.saved_properties ENABLE ROW LEVEL SECURITY;

-- Create policy that allows users to SELECT their own saved properties
CREATE POLICY "Users can view their own saved properties" 
  ON public.saved_properties 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy that allows users to INSERT their own saved properties
CREATE POLICY "Users can save their own properties" 
  ON public.saved_properties 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create policy that allows users to DELETE their own saved properties
CREATE POLICY "Users can remove their own saved properties" 
  ON public.saved_properties 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_saved_properties_user_id ON public.saved_properties(user_id);
CREATE INDEX idx_saved_properties_property ON public.saved_properties(property_id, property_type);
