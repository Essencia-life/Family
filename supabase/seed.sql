-- Placeholder content from the prototype. Teachers, titles and texts are examples to replace.
-- video_id is empty everywhere: the player shows the artwork until a real video id is set.

insert into public.practices (week, type, title, teacher, minutes, description, published_on) values
  (47, 'Yoga',       'Rooting Flow',          'Mara',  22, 'A slow flow to wake the legs and the spine, ending with a long rest on the earth.', '2026-11-16'),
  (46, 'Breathwork', 'Rising Breath',         'Juno',  15, 'Three rounds of energising breath, then stillness. Best on an empty stomach.', '2026-11-09'),
  (45, 'Qi Gong',    'Pouring Water',         'Sana',  18, 'Gentle, flowing movements that bring the body and the mind into one rhythm.', '2026-11-02'),
  (44, 'Meditation', 'Sitting with the Dawn', 'Tomás', 12, 'A simple seated practice. No experience needed, only a place to sit.', '2026-10-26'),
  (43, 'Yoga',       'Hips & Hearth',         'Mara',  25, 'Long, supported holds for the hips, with time to arrive and to soften.', '2026-10-19'),
  (42, 'Movement',   'Shake & Settle',        'Kaï',   14, 'Shaking, stretching and free movement to clear the night away.', '2026-10-12'),
  (41, 'Breathwork', 'The Long Exhale',       'Juno',  16, 'Slow breathing that calms the nervous system before a busy day.', '2026-10-05'),
  (40, 'Qi Gong',    'Tree and Sky',          'Sana',  20, 'Standing practice to root down and reach up, like the oaks around us.', '2026-09-28');

insert into public.courses (slug, title, blurb, level, duration, colors, position) values
  ('permaculture', 'Permaculture Foundations', 'Read the land, design with it, and grow food that looks after itself.', 'Beginner', '3 h 20', '{#3A4B39,#9db280}', 1),
  ('ecovillage',   'Designing an Eco-Village', 'From a shared vision to buildings, land and legal form.', 'Beginner', '2 h 40', '{#60482F,#C4922A}', 2),
  ('community',    'Community Living',         'Honest communication, shared decisions and living well with others.', 'All levels', '3 h 00', '{#2c4a52,#8fb9c4}', 3),
  ('offgrid',      'Off-Grid Living',          'Power, water and waste, solved with simple, lasting systems.', 'Intermediate', '2 h 10', '{#1f2a1f,#C4922A}', 4);

insert into public.lessons (course_slug, position, title, body)
select c.slug, l.ord, l.title, c.blurb || ' In this lesson we take the next step together, with examples from the land at Essência.'
from public.courses c
join (values
  ('permaculture', array['What permaculture is','Reading your land','Water: catch, slow, store','Soil and compost','Food forests','Planning a garden','Seasons and care','Your first design']),
  ('ecovillage',   array['The vision','Choosing land','Legal forms and cooperatives','Buildings and shared spaces','Money and fair exchange','Growing step by step']),
  ('community',    array['Why we live together','Agreements that hold','Honest communication','Making decisions together','Conflict and repair','Roles and responsibility','Rest and celebration']),
  ('offgrid',      array['Living with the sun','Water on the land','Toilets and waste','Heat and comfort'])
) as t(slug, titles) on t.slug = c.slug
cross join lateral unnest(t.titles) with ordinality as l(title, ord);

insert into public.recordings (slug, title, recorded_on, minutes, description) values
  ('trust-and-transparency', 'ZEGG Forum: Trust and Transparency', '2026-11-12', 94, 'A recorded ZEGG Forum round from our community. See how the Forum works and what it brings to the surface.'),
  ('money-and-belonging',    'ZEGG Forum: Money and Belonging',    '2026-10-15', 88, 'A recorded ZEGG Forum round on what money means to us and how we share it.'),
  ('arriving',               'ZEGG Forum: Arriving',               '2026-09-17', 76, 'A recorded ZEGG Forum round for newcomers: an introduction through practice.');

-- Placeholder members so the example threads have authors.
insert into next_auth.users (id, name, email) values
  ('00000000-0000-0000-0000-000000000001', 'Freya', 'freya@example.com'),
  ('00000000-0000-0000-0000-000000000002', 'Tomás', 'tomas@example.com'),
  ('00000000-0000-0000-0000-000000000003', 'Kaï',   'kai@example.com'),
  ('00000000-0000-0000-0000-000000000004', 'Sana',  'sana@example.com'),
  ('00000000-0000-0000-0000-000000000005', 'Mara',  'mara@example.com');

insert into public.threads (id, category, title, body, author_id, author_name, created_at) values
  ('10000000-0000-0000-0000-000000000001', 'Permaculture', 'Best cover crop for heavy clay?', 'Our soil is very clayey and we want to start green manure this winter. What has worked for you?', '00000000-0000-0000-0000-000000000001', 'Freya', now() - interval '3 days'),
  ('10000000-0000-0000-0000-000000000002', 'Community life', 'How do you hold a check-in circle?', 'We want to begin our weekly meeting with a short check-in. Any structure that keeps it short and honest?', '00000000-0000-0000-0000-000000000003', 'Kaï', now() - interval '2 days'),
  ('10000000-0000-0000-0000-000000000003', 'Practice', 'Short version of the morning flow?', 'Some mornings I only have ten minutes. Which part of the practice would you keep?', '00000000-0000-0000-0000-000000000004', 'Sana', now() - interval '1 day');

insert into public.replies (thread_id, author_id, author_name, body) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Tomás', 'Field beans and phacelia did well for us. Chop and drop in spring.'),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000005', 'Mara', 'The first five minutes and the final rest. That is the heart of it.');

-- Membership plan (20 Nov 2026). Placeholder creators, links and themes to replace.
update public.courses set creator = 'Essência', creator_url = 'https://essencia.life' where creator is null;

-- Guess: Monday and Thursday at 08:00 Lisbon time, the morning practice streamed live.
-- Four weeks ahead and two weeks back from the day the seed runs; past ones show as recordings.
insert into public.live_sessions (title, host, starts_at, minutes, description)
select
  case extract(isodow from d) when 1 then 'Monday morning practice' else 'Thursday morning practice' end,
  case extract(isodow from d) when 1 then 'Mara' else 'Juno' end,
  (d + time '08:00') at time zone 'Europe/Lisbon',
  45,
  'Live from the land at Essência. Join from wherever you are, camera on or off.'
from generate_series(current_date - 14, current_date + 28, interval '1 day') as g(d)
where extract(isodow from d) in (1, 4);

insert into public.moon_themes (circle_on, theme, invitation) values
  ('2026-12-09', 'Remembering', 'What did you remember about yourself this month? Bring one moment to share.'),
  ('2027-01-07', 'Seeds', 'Which intention do you want to plant for the year ahead?'),
  ('2027-02-06', 'Blossoming', 'Where do you feel something opening in you?');
