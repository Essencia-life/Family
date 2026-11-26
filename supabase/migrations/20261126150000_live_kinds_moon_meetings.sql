-- Live sessions are either a live-streamed morning practice (YouTube for now) or another live session.
alter table public.live_sessions
  add column kind text not null default 'Live session' check (kind in ('Morning practice', 'Live session'));

-- The new moon meeting gets its own time and call link, planned next to the month's theme.
alter table public.moon_themes
  add column starts_at timestamptz,
  add column join_url text;
