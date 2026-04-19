
-- Add username column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN username TEXT UNIQUE;

-- Create index for fast username lookups
CREATE INDEX idx_profiles_username ON public.profiles(username);

-- Add check constraint for valid username format
ALTER TABLE public.profiles 
ADD CONSTRAINT username_format CHECK (
  username IS NULL OR 
  (username ~* '^[a-zA-Z0-9_-]+$' AND length(username) <= 20)
);

-- Update the handle_new_user function to also set username if provided
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, username)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', 'Cultivator'),
    NULL
  );
  RETURN NEW;
END;
$$;

-- Allow users to update their own username
CREATE POLICY "Users can update their own username" ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);
