-- Practices get their own id, so a week can hold more than one practice. `week` stays as a normal column.
alter table public.practices add column id uuid not null default gen_random_uuid();

alter table public.practised add column practice_id uuid;
update public.practised d set practice_id = p.id from public.practices p where p.week = d.week;
alter table public.practised drop constraint practised_pkey, drop constraint practised_week_fkey, drop column week;
alter table public.practised alter column practice_id set not null;

alter table public.practices drop constraint practices_pkey, add primary key (id);
alter table public.practised
  add primary key (user_id, practice_id),
  add foreign key (practice_id) references public.practices (id) on delete cascade;

create index on public.practices (week desc);
