-- Fix lesson_id and quiz_id to accept text (seed lesson/quiz IDs like "seed-1-0")
-- Also adds missing INSERT policy for user_achievements and week_number to submissions.
-- Run this in the Supabase SQL Editor.

-- lesson_progress: drop UUID FK, change to text
ALTER TABLE public.lesson_progress
  DROP CONSTRAINT IF EXISTS lesson_progress_lesson_id_fkey;
ALTER TABLE public.lesson_progress
  ALTER COLUMN lesson_id TYPE text USING lesson_id::text;

-- quiz_attempts: drop UUID FK, change to text
ALTER TABLE public.quiz_attempts
  DROP CONSTRAINT IF EXISTS quiz_attempts_quiz_id_fkey;
ALTER TABLE public.quiz_attempts
  ALTER COLUMN quiz_id TYPE text USING quiz_id::text;

-- submissions: add week_number so seed homework submissions can be tracked
ALTER TABLE public.submissions
  ADD COLUMN IF NOT EXISTS week_number int;

-- Allow students to earn their own badges (was missing)
DROP POLICY IF EXISTS "Users earn own badges" ON public.user_achievements;
CREATE POLICY "Users earn own badges" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);
