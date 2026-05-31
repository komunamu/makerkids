-- Add unique constraint on weeks so seeding can use upsert
alter table public.weeks
  add constraint weeks_course_week_unique unique (course_id, week_number);

-- Add unique constraint on homework per week
alter table public.homework
  add constraint homework_week_unique unique (week_id);

-- Storage bucket policies (run after creating buckets in Supabase dashboard)
-- homework-uploads: authenticated users can upload their own files
-- project-photos: public read, authenticated write

-- Allow authenticated users to upload to homework-uploads
insert into storage.buckets (id, name, public) values ('homework-uploads', 'homework-uploads', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('project-photos', 'project-photos', true)
  on conflict (id) do nothing;

-- Homework uploads: users can upload their own files
create policy "Users upload own homework" on storage.objects
  for insert with check (
    bucket_id = 'homework-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users view own homework" on storage.objects
  for select using (
    bucket_id = 'homework-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Parent/admin can view all homework uploads
create policy "Parents view homework files" on storage.objects
  for select using (
    bucket_id = 'homework-uploads' and
    exists (
      select 1 from public.users where id = auth.uid() and role in ('parent', 'admin')
    )
  );

-- Project photos: public read
create policy "Public read project photos" on storage.objects
  for select using (bucket_id = 'project-photos');

create policy "Users upload own project photos" on storage.objects
  for insert with check (
    bucket_id = 'project-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
