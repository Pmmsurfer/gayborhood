-- PLACES
create table places (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,           -- 'westla', 'sf', 'brooklyn'
  name text not null,                  -- 'West Side LA'
  city text not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

insert into places (slug, name, city) values
  ('westla', 'West Side LA', 'Los Angeles'),
  ('sf', 'San Francisco', 'San Francisco'),
  ('brooklyn', 'Brooklyn', 'New York');

-- COMMUNITIES
create table communities (
  id uuid primary key default gen_random_uuid(),
  place_slug text references places(slug) not null,
  slug text not null,                  -- 'gayborhood', 'surfers', 'neighbor'
  name text not null,                  -- display name
  description text,                    -- one-line description
  admin_email text,
  is_active boolean default true,
  member_count integer default 0,      -- denormalized
  created_at timestamptz default now(),
  unique(place_slug, slug)
);

insert into communities (place_slug, slug, name, description, is_active) values
  ('westla', 'gayborhood', 'gayborhood', 'gay men on the west side', true),
  ('sf', 'gayborhood', 'gayborhood', 'gay men in sf', false),
  ('brooklyn', 'gayborhood', 'gayborhood', 'gay men in brooklyn', false);

-- CREWS
create table crews (
  id uuid primary key default gen_random_uuid(),
  place_slug text not null,
  community_slug text not null,
  slug text not null,                  -- 'dawn-patrol', 'sunday-dinner'
  name text not null,
  description text,
  organizer_name text,
  cadence text,                        -- 'weekly', 'monthly', 'irregular'
  member_count integer default 0,      -- denormalized: people with 3+ attendances
  total_attendances integer default 0, -- denormalized: all verified check-ins
  is_visible boolean default false,    -- becomes true after 3 events
  created_at timestamptz default now(),
  unique(place_slug, community_slug, slug)
);

-- SUBSCRIBERS
create table subscribers (
  id uuid primary key default gen_random_uuid(),
  place_slug text not null,
  community_slug text not null,
  email text not null,
  name text,
  neighborhood text,
  created_at timestamptz default now(),
  unique(place_slug, community_slug, email)
);

-- CLAIMED NAMES
create table claimed_names (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,           -- 'Marcus T.'
  email text unique not null,
  verified boolean default false,      -- true after magic link clicked
  created_at timestamptz default now()
);

-- POSTS
create table posts (
  id uuid primary key default gen_random_uuid(),
  place_slug text not null,
  community_slug text not null,
  crew_slug text,                      -- optional crew association
  category text not null,
  title text not null,
  body text not null,
  author_name text not null default 'anonymous',
  neighborhood text,
  email text,                          -- never shown publicly
  host_token text,                     -- uuid for check-in access (events only)
  -- event fields
  event_date date,
  event_time time,
  max_attendees integer,
  house_rule text,
  first_timers_welcome boolean default false,
  -- paid event fields
  price_cents integer,
  payment_link text,
  -- denormalized counts
  like_count integer default 0,
  reply_count integer default 0,
  rsvp_count integer default 0,
  -- metadata
  created_at timestamptz default now(),
  is_approved boolean default true
);

-- REPLIES
create table replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  place_slug text not null,
  community_slug text not null,
  body text not null,
  author_name text not null default 'anonymous',
  neighborhood text,
  like_count integer default 0,
  created_at timestamptz default now()
);

-- RSVPS
create table rsvps (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  name text not null,
  neighborhood text,
  email text,
  is_first_timer boolean default false,
  checked_in boolean default false,    -- marked by host at event
  checked_in_at timestamptz,
  created_at timestamptz default now()
);

-- PLACE REQUESTS
create table place_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  city text not null,
  community_idea text,
  created_at timestamptz default now()
);

-- RLS
alter table places         enable row level security;
alter table communities    enable row level security;
alter table crews          enable row level security;
alter table subscribers    enable row level security;
alter table claimed_names  enable row level security;
alter table posts          enable row level security;
alter table replies        enable row level security;
alter table rsvps          enable row level security;
alter table place_requests enable row level security;

-- Public read
create policy "public read places"      on places      for select to anon using (true);
create policy "public read communities" on communities for select to anon using (is_active = true);
create policy "public read crews"       on crews       for select to anon using (is_visible = true);
create policy "public read posts"       on posts       for select to anon using (is_approved = true);
create policy "public read replies"     on replies     for select to anon using (true);
create policy "public read rsvps"       on rsvps       for select to anon using (true);
create policy "public read names"       on claimed_names for select to anon using (verified = true);

-- Public insert
create policy "public insert posts"         on posts          for insert to anon with check (true);
create policy "public insert replies"       on replies        for insert to anon with check (true);
create policy "public insert rsvps"         on rsvps          for insert to anon with check (true);
create policy "public insert subscribers"   on subscribers    for insert to anon with check (true);
create policy "public insert communities"   on communities    for insert to anon with check (true);
create policy "public insert place_req"     on place_requests for insert to anon with check (true);
create policy "public insert names"         on claimed_names  for insert to anon with check (true);

-- Like increment RPC
create or replace function increment_like(target_table text, row_id uuid)
returns void language plpgsql security definer as $$
begin
  if target_table = 'posts' then
    update posts set like_count = like_count + 1 where id = row_id;
  elsif target_table = 'replies' then
    update replies set like_count = like_count + 1 where id = row_id;
  end if;
end;
$$;

-- Auto-update reply_count and rsvp_count
create or replace function update_post_counts() returns trigger language plpgsql as $$
begin
  if TG_TABLE_NAME = 'replies' then
    update posts set reply_count = (
      select count(*) from replies where post_id = NEW.post_id
    ) where id = NEW.post_id;
  elsif TG_TABLE_NAME = 'rsvps' then
    update posts set rsvp_count = (
      select count(*) from rsvps where post_id = NEW.post_id
    ) where id = NEW.post_id;
  end if;
  return NEW;
end;
$$;

create trigger on_reply_insert after insert on replies for each row execute function update_post_counts();
create trigger on_rsvp_insert  after insert on rsvps  for each row execute function update_post_counts();

-- Auto-update crew attendance count on check-in
create or replace function update_crew_counts() returns trigger language plpgsql as $$
declare
  v_crew_slug text;
  v_place text;
  v_community text;
begin
  if NEW.checked_in = true and OLD.checked_in = false then
    select crew_slug, place_slug, community_slug
    into v_crew_slug, v_place, v_community
    from posts where id = NEW.post_id;

    if v_crew_slug is not null then
      update crews
      set total_attendances = total_attendances + 1
      where slug = v_crew_slug
        and place_slug = v_place
        and community_slug = v_community;
    end if;
  end if;
  return NEW;
end;
$$;

create trigger on_checkin after update on rsvps for each row execute function update_crew_counts();

-- Generate host_token on event insert
create or replace function set_host_token() returns trigger language plpgsql as $$
begin
  if NEW.event_date is not null and NEW.host_token is null then
    NEW.host_token := gen_random_uuid()::text;
  end if;
  return NEW;
end;
$$;

create trigger before_post_insert before insert on posts for each row execute function set_host_token();
