-- Auth.js tables, as expected by @auth/supabase-adapter.
-- Add "next_auth" to Exposed schemas in Supabase: Project settings > Data API.
create schema if not exists next_auth;
grant usage on schema next_auth to service_role;
grant all on schema next_auth to postgres;

create table next_auth.users (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text unique,
  "emailVerified" timestamptz,
  image text
);

create table next_auth.sessions (
  id uuid primary key default gen_random_uuid(),
  expires timestamptz not null,
  "sessionToken" text not null unique,
  "userId" uuid references next_auth.users (id) on delete cascade
);

create table next_auth.accounts (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at bigint,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  oauth_token_secret text,
  oauth_token text,
  "userId" uuid references next_auth.users (id) on delete cascade,
  unique (provider, "providerAccountId")
);

create table next_auth.verification_tokens (
  identifier text,
  token text primary key,
  expires timestamptz not null,
  unique (token, identifier)
);

grant all on all tables in schema next_auth to postgres, service_role;

-- Content. Videos are stored as provider + id so the provider can change per item (see src/lib/video.ts).
create table public.practices (
  week int primary key,
  type text not null,
  title text not null,
  teacher text not null,
  minutes int not null,
  description text not null default '',
  video_provider text not null default 'youtube',
  video_id text,
  published_on date not null default current_date
);

create table public.courses (
  slug text primary key,
  title text not null,
  blurb text not null default '',
  level text not null,
  duration text not null,
  colors text[] not null default '{#3A4B39,#9db280}',
  position int not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  course_slug text not null references public.courses (slug) on delete cascade,
  position int not null,
  title text not null,
  body text not null default '',
  video_provider text not null default 'youtube',
  video_id text,
  unique (course_slug, position)
);

create table public.recordings (
  slug text primary key,
  title text not null,
  recorded_on date not null,
  minutes int not null,
  description text not null default '',
  video_provider text not null default 'youtube',
  video_id text
);

-- Community
create table public.threads (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  body text not null,
  author_id uuid not null references next_auth.users (id) on delete cascade,
  author_name text not null, -- copied at write time: PostgREST cannot join across schemas
  created_at timestamptz not null default now()
);

create table public.replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.threads (id) on delete cascade,
  author_id uuid not null references next_auth.users (id) on delete cascade,
  author_name text not null, -- copied at write time: PostgREST cannot join across schemas
  body text not null,
  created_at timestamptz not null default now()
);

create table public.circle_rsvps (
  user_id uuid not null references next_auth.users (id) on delete cascade,
  circle_on date not null,
  primary key (user_id, circle_on)
);

-- Per-member progress
create table public.practised (
  user_id uuid not null references next_auth.users (id) on delete cascade,
  week int not null references public.practices (week) on delete cascade,
  primary key (user_id, week)
);

create table public.lesson_progress (
  user_id uuid not null references next_auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  primary key (user_id, lesson_id)
);

-- Filled by the payment provider once that is decided.
create table public.memberships (
  user_id uuid primary key references next_auth.users (id) on delete cascade,
  plan text not null check (plan in ('monthly', 'yearly')),
  status text not null check (status in ('active', 'past_due', 'canceled')),
  renews_on date
);

-- The app talks to Supabase only from the server with the service role key, which bypasses RLS.
-- RLS without policies keeps the anon key from reading anything.
alter table public.practices enable row level security;
alter table public.courses enable row level security;
alter table public.lessons enable row level security;
alter table public.recordings enable row level security;
alter table public.threads enable row level security;
alter table public.replies enable row level security;
alter table public.circle_rsvps enable row level security;
alter table public.practised enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.memberships enable row level security;
