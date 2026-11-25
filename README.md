# Essência Family

Membership platform for Essência Family: a weekly morning practice, courses with lesson progress, new moon sharing circles, ZEGG Forum recordings and a members' exchange.

Built with SvelteKit 3 (remote functions), Auth.js and Supabase.

## Setup

1. Create a Supabase project and run `supabase/migrations/*.sql`, then `supabase/seed.sql` for the placeholder content (SQL editor or `supabase db push`).
2. In Supabase, **Project settings > Data API > Exposed schemas**, add `next_auth` (Auth.js keeps users and sessions there).
3. `cp .env.example .env` and fill it in. At least one login provider (email or Google) must be set.
4. `npm install` and `npm run dev`.

## How it fits together

- **Data**: every read and write is a remote function in `src/lib/remote/*.remote.ts`. They run on the server with the Supabase service role key and call `requireMember()` first, so the browser never talks to Supabase directly. RLS is on with no policies, so the anon key reads nothing.
- **Login**: `src/auth.ts` (Auth.js with the Supabase adapter). Sign-in page is `/auth/signin`.
- **Videos**: rows store `video_provider` + `video_id`. `src/lib/video.ts` turns them into an embed URL. To switch from YouTube, add a provider there and update the rows. Rows without `video_id` show the artwork with "Video coming soon".
- **Membership**: `public.memberships` is ready for a payment provider. Until payments exist, every signed-in person has access (see `src/lib/server/guard.ts`).

## Scripts

- `npm run dev`: local server
- `npm run check`: type check
- `npm test`: unit tests
- `npm run build`: production build (needs the env vars)

The deploy target is not chosen yet, so `adapter-auto` is in place.
