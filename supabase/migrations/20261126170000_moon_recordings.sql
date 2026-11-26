-- Optional recording of each new moon meeting, shown on the community page once it has a video id.
alter table public.moon_themes
  add column if not exists video_provider text not null default 'youtube',
  add column if not exists video_id text;
