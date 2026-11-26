-- When a member marked a practice, for the "mornings" rhythm on the home page.
alter table public.practised add column practised_at timestamptz not null default now();
