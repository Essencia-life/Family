-- Follows the membership plan from 20 Nov 2026: live sessions, new moon themes, intro classes linking to creators.

-- Two live sessions a week. Once a recording exists, set video_id and it shows up under recordings.
create table public.live_sessions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  host text not null,
  starts_at timestamptz not null,
  minutes int not null default 60,
  description text not null default '',
  join_url text,
  video_provider text not null default 'youtube',
  video_id text
);
create index live_sessions_starts_at on public.live_sessions (starts_at);

-- Theme and invitation for each monthly new moon check-in.
create table public.moon_themes (
  circle_on date primary key,
  theme text not null,
  invitation text not null default ''
);

-- Courses here are short intro classes; the full course lives on the creator's own website.
alter table public.courses
  add column creator text,
  add column creator_url text;

alter table public.live_sessions enable row level security;
alter table public.moon_themes enable row level security;
