-- Profiles: one per auth user (display name for posts/communities)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Anonymous',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(trim(new.raw_user_meta_data->>'display_name'), 'Anonymous')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Link communities and posts to creator (optional; keeps existing rows valid)
alter table communities
  add column if not exists created_by_id uuid references auth.users(id) on delete set null;

alter table posts
  add column if not exists author_id uuid references auth.users(id) on delete set null;

-- RLS for profiles
alter table profiles enable row level security;

create policy "public read profiles"
  on profiles for select to anon using (true);

create policy "authenticated read profiles"
  on profiles for select to authenticated using (true);

create policy "users update own profile"
  on profiles for update to authenticated using (auth.uid() = id)
  with check (auth.uid() = id);

-- Only authenticated users may create communities and posts (anon insert removed below)
drop policy if exists "public insert communities" on communities;
drop policy if exists "public insert posts" on posts;

create policy "authenticated insert communities"
  on communities for insert to authenticated with check (true);

create policy "authenticated insert posts"
  on posts for insert to authenticated with check (true);

-- Authenticated users may insert replies and rsvps (keep anon for now so existing flows work; optional: drop anon insert later)
-- We keep anon insert for replies/rsvps so that non-logged-in users can still RSVP/reply if you want.
-- If you want to require auth for replies too, add:
-- drop policy if exists "public insert replies" on replies;
-- create policy "authenticated insert replies" on replies for insert to authenticated with check (true);
