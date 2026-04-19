
-- Add username column to profiles table (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT UNIQUE;
  END IF;
END $$;

-- Create index for fast username lookups (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_profiles_username'
  ) THEN
    CREATE INDEX idx_profiles_username ON public.profiles(username);
  END IF;
END $$;

-- Add check constraint for valid username format (if not exists)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'profiles' AND constraint_name = 'username_format'
  ) THEN
    ALTER TABLE public.profiles 
    ADD CONSTRAINT username_format CHECK (
      username IS NULL OR 
      (username ~* '^[a-zA-Z0-9_-]+$' AND length(username) <= 20)
    );
  END IF;
END $$;
