-- Supabase Database Schema for Chizel MVP

-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_type TEXT,
  age_group TEXT,
  onboarding_done BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = user_id);


-- 2. Create quiz answers table
CREATE TABLE IF NOT EXISTS public.quiz_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question_index INTEGER NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, question_index)
);

-- Enable RLS for quiz_answers
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own answers" 
ON public.quiz_answers FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own answers" 
ON public.quiz_answers FOR SELECT 
USING (auth.uid() = user_id);


-- 3. Create mission progress table
CREATE TABLE IF NOT EXISTS public.mission_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  mission INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  points INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, day, mission)
);

-- Enable RLS for mission_progress
ALTER TABLE public.mission_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own progress" 
ON public.mission_progress FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own progress" 
ON public.mission_progress FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" 
ON public.mission_progress FOR UPDATE 
USING (auth.uid() = user_id);


-- 4. Create Storage Bucket for Missions
-- Note: Requires superuser/dashboard access, or run manually in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public) 
VALUES ('mission_uploads', 'mission_uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS Policies
CREATE POLICY "Users can upload their own mission files" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'mission_uploads' AND 
  auth.uid() = owner
);

CREATE POLICY "Users can update their own mission files" 
ON storage.objects FOR UPDATE 
USING (
  bucket_id = 'mission_uploads' AND 
  auth.uid() = owner
);

CREATE POLICY "Files are publicly accessible" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'mission_uploads');

CREATE POLICY "Users can delete own files" 
ON storage.objects FOR DELETE 
USING (
  bucket_id = 'mission_uploads' AND 
  auth.uid() = owner
);
