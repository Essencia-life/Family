-- Live streams are practices: a practice with `starts_at` in the future is a planned YouTube live stream,
-- afterwards the same video id is its recording in the library. Replaces the live_sessions table.
alter table public.practices add column starts_at timestamptz;
create index on public.practices (starts_at);

-- Existing live sessions become practices (type Meditation, week of the year they ran).
insert into public.practices (week, type, title, teacher, minutes, description, video_provider, video_id, published_on, starts_at, created_at)
select extract(week from starts_at)::int, 'Meditation', title, host, minutes, description, video_provider, video_id,
  (starts_at at time zone 'Europe/Lisbon')::date, starts_at, now()
from public.live_sessions;
drop table public.live_sessions;

-- The new moon meeting gets its own time and call link, planned next to the month's theme.
alter table public.moon_themes
  add column starts_at timestamptz,
  add column join_url text;
