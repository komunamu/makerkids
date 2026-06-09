-- Run this in the Supabase SQL editor to fix storage upload permissions.
-- Safe to re-run: drops existing policies before recreating them.

-- Ensure buckets exist
insert into storage.buckets (id, name, public) values ('homework-uploads', 'homework-uploads', false)
  on conflict (id) do nothing;

insert into storage.buckets (id, name, public) values ('project-photos', 'project-photos', true)
  on conflict (id) do nothing;

-- Drop and recreate homework-uploads policies
drop policy if exists "Users upload own homework" on storage.objects;
drop policy if exists "Users view own homework" on storage.objects;
drop policy if exists "Parents view homework files" on storage.objects;

create policy "Users upload own homework" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'homework-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Users view own homework" on storage.objects
  for select to authenticated using (
    bucket_id = 'homework-uploads' and
    auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Parents view homework files" on storage.objects
  for select to authenticated using (
    bucket_id = 'homework-uploads' and
    exists (
      select 1 from public.users where id = auth.uid() and role in ('parent', 'admin')
    )
  );

-- Drop and recreate project-photos policies
drop policy if exists "Public read project photos" on storage.objects;
drop policy if exists "Users upload own project photos" on storage.objects;

create policy "Public read project photos" on storage.objects
  for select using (bucket_id = 'project-photos');

create policy "Users upload own project photos" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'project-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
