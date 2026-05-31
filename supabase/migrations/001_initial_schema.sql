-- ============================================================
-- MakerKids 3D Printing Platform — Initial Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS (extends Supabase auth.users)
-- ============================================================
create table public.users (
  id uuid references auth.users(id) on delete cascade primary key,
  email text not null,
  display_name text,
  avatar_url text,
  role text not null default 'student' check (role in ('student', 'parent', 'admin')),
  parent_id uuid references public.users(id),
  created_at timestamptz default now(),
  last_login timestamptz
);

-- ============================================================
-- COURSES
-- ============================================================
create table public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  total_weeks int default 8,
  is_active boolean default true,
  created_by uuid references public.users(id),
  created_at timestamptz default now()
);

-- ============================================================
-- WEEKS
-- ============================================================
create table public.weeks (
  id uuid default uuid_generate_v4() primary key,
  course_id uuid references public.courses(id) on delete cascade,
  week_number int not null,
  title text not null,
  objectives text[],
  is_published boolean default true,
  created_at timestamptz default now()
);

-- ============================================================
-- LESSONS
-- ============================================================
create table public.lessons (
  id uuid default uuid_generate_v4() primary key,
  week_id uuid references public.weeks(id) on delete cascade,
  title text not null,
  content_markdown text,
  order_index int default 0,
  estimated_minutes int default 30,
  created_at timestamptz default now()
);

-- ============================================================
-- VIDEOS
-- ============================================================
create table public.videos (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  youtube_url text not null,
  youtube_id text not null,
  duration_seconds int,
  order_index int default 0
);

-- ============================================================
-- ENROLLMENTS
-- ============================================================
create table public.enrollments (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  enrolled_at timestamptz default now(),
  completed_at timestamptz,
  unique(user_id, course_id)
);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
create table public.lesson_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  status text default 'not_started' check (status in ('not_started', 'in_progress', 'complete')),
  completed_at timestamptz,
  time_spent_seconds int default 0,
  unique(user_id, lesson_id)
);

-- ============================================================
-- HOMEWORK
-- ============================================================
create table public.homework (
  id uuid default uuid_generate_v4() primary key,
  week_id uuid references public.weeks(id) on delete cascade,
  title text not null,
  description text,
  due_offset_days int default 7,
  max_score int default 10
);

-- ============================================================
-- SUBMISSIONS
-- ============================================================
create table public.submissions (
  id uuid default uuid_generate_v4() primary key,
  homework_id uuid references public.homework(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  submitted_at timestamptz default now(),
  content text,
  file_url text,
  score int,
  feedback text,
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz
);

-- ============================================================
-- QUIZZES
-- ============================================================
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  lesson_id uuid references public.lessons(id) on delete cascade,
  title text not null,
  passing_score int default 70
);

create table public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  question_text text not null,
  order_index int default 0
);

create table public.quiz_options (
  id uuid default uuid_generate_v4() primary key,
  question_id uuid references public.quiz_questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean default false
);

create table public.quiz_attempts (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  score int,
  passed boolean default false,
  attempted_at timestamptz default now(),
  answers_json jsonb
);

-- ============================================================
-- PROJECTS
-- ============================================================
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  week_id uuid references public.weeks(id),
  title text not null,
  description text,
  photo_url text,
  stl_url text,
  is_public boolean default false,
  submitted_at timestamptz default now(),
  feedback text
);

-- ============================================================
-- ACHIEVEMENTS
-- ============================================================
create table public.achievements (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  icon_emoji text,
  condition_type text,
  condition_value int
);

create table public.user_achievements (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  achievement_id uuid references public.achievements(id) on delete cascade,
  earned_at timestamptz default now(),
  unique(user_id, achievement_id)
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.weeks enable row level security;
alter table public.lessons enable row level security;
alter table public.videos enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.homework enable row level security;
alter table public.submissions enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.projects enable row level security;
alter table public.achievements enable row level security;
alter table public.user_achievements enable row level security;

-- Users: see own profile or parent sees children
create policy "Users can view own profile" on public.users
  for select using (auth.uid() = id or auth.uid() = parent_id);

create policy "Users can update own profile" on public.users
  for update using (auth.uid() = id);

-- Courses: everyone enrolled can see
create policy "Anyone can view active courses" on public.courses
  for select using (is_active = true);

-- Weeks & Lessons: any authenticated user
create policy "Auth users view weeks" on public.weeks
  for select using (auth.role() = 'authenticated');

create policy "Auth users view lessons" on public.lessons
  for select using (auth.role() = 'authenticated');

create policy "Auth users view videos" on public.videos
  for select using (auth.role() = 'authenticated');

-- Lesson progress: own only
create policy "Own progress only" on public.lesson_progress
  for all using (auth.uid() = user_id);

-- Submissions: own or parent
create policy "Own submissions" on public.submissions
  for select using (
    auth.uid() = user_id or
    auth.uid() in (select id from public.users where id = (select parent_id from public.users where id = user_id))
  );

create policy "Insert own submission" on public.submissions
  for insert with check (auth.uid() = user_id);

-- Quiz attempts: own only
create policy "Own quiz attempts" on public.quiz_attempts
  for all using (auth.uid() = user_id);

-- Projects: own or public
create policy "View own or public projects" on public.projects
  for select using (auth.uid() = user_id or is_public = true);

create policy "Insert own project" on public.projects
  for insert with check (auth.uid() = user_id);

create policy "Update own project" on public.projects
  for update using (auth.uid() = user_id);

-- Achievements: readable by all authenticated
create policy "View achievements" on public.achievements
  for select using (auth.role() = 'authenticated');

create policy "View own badges" on public.user_achievements
  for select using (auth.uid() = user_id);

-- Homework: readable by authenticated
create policy "View homework" on public.homework
  for select using (auth.role() = 'authenticated');

-- ============================================================
-- SEED: Default Course
-- ============================================================
insert into public.courses (title, description, total_weeks, is_active) values
  ('Summer 3D Printing & TinkerCAD', 'Learn 3D design, slicing, and printing in 8 weeks — from first print to capstone project.', 8, true);

-- ============================================================
-- SEED: Achievements
-- ============================================================
insert into public.achievements (title, description, icon_emoji, condition_type, condition_value) values
  ('First Print', 'Completed your very first 3D print', '🖨️', 'prints_completed', 1),
  ('Designer', 'Completed Week 2 TinkerCAD lessons', '🎨', 'week_completed', 2),
  ('Precision', 'Completed the Measurements week', '📐', 'week_completed', 3),
  ('Keychain', 'Printed your first custom keychain', '🔑', 'projects_completed', 1),
  ('Ruler Pro', 'Designed the printable ruler project', '📏', 'week_completed', 3),
  ('Slicer', 'Completed the Cura slicing week', '⚙️', 'week_completed', 5),
  ('Multi-Part', 'Assembled your first multi-part print', '🔧', 'week_completed', 6),
  ('Innovator', 'Completed the product design challenge', '💡', 'week_completed', 7),
  ('Capstone', 'Completed the final capstone project', '🏆', 'week_completed', 8),
  ('All-Star', 'Earned 5 or more badges', '⭐', 'badges_earned', 5),
  ('Quiz Ace', 'Passed 3 quizzes with perfect scores', '🧠', 'perfect_quizzes', 3),
  ('Gallery Star', 'Shared 3 projects to the gallery', '📸', 'public_projects', 3),
  ('Consistent', 'Completed lessons 3 weeks in a row', '🔥', 'week_streak', 3),
  ('Researcher', 'Watched all recommended tutorial videos', '🎬', 'videos_watched', 20),
  ('Graduate', 'Completed all 8 weeks', '🎓', 'weeks_completed', 8);
