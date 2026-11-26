-- Notification center (bell in the header): what is new since a member last opened it.

-- When each member last opened the bell. No row yet: the bell shows the last 14 days.
create table public.notifications_seen (
  user_id uuid primary key references next_auth.users (id) on delete cascade,
  seen_at timestamptz not null default now()
);
alter table public.notifications_seen enable row level security;

-- When content was added. Existing rows get an old date so they do not all show up as new.
alter table public.practices add column created_at timestamptz not null default '2000-01-01';
alter table public.practices alter column created_at set default now();
alter table public.courses add column created_at timestamptz not null default '2000-01-01';
alter table public.courses alter column created_at set default now();
alter table public.recordings add column created_at timestamptz not null default '2000-01-01';
alter table public.recordings alter column created_at set default now();

create index on public.threads (created_at desc);
create index on public.replies (created_at desc);
