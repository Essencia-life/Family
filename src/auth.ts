import { SvelteKitAuth } from '@auth/sveltekit';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import Google from '@auth/sveltekit/providers/google';
import Resend from '@auth/sveltekit/providers/resend';
import {
	AUTH_EMAIL_FROM,
	AUTH_GOOGLE_ID,
	AUTH_GOOGLE_SECRET,
	RESEND_API_KEY,
	AUTH_SECRET,
	SUPABASE_SERVICE_ROLE_KEY,
	SUPABASE_URL
} from '$app/env/private';

// Users, accounts and sessions live in the `next_auth` schema in Supabase (see supabase/migrations).
export const { handle, signIn, signOut } = SvelteKitAuth({
	secret: AUTH_SECRET,
	trustHost: true,
	adapter: SupabaseAdapter({ url: SUPABASE_URL, secret: SUPABASE_SERVICE_ROLE_KEY }),
	providers: [
		...(RESEND_API_KEY
			? [Resend({ name: 'Email', apiKey: RESEND_API_KEY, from: AUTH_EMAIL_FROM ?? 'Essência Family <no-reply@essencia.family>' })]
			: []),
		...(AUTH_GOOGLE_ID ? [Google({ clientId: AUTH_GOOGLE_ID, clientSecret: AUTH_GOOGLE_SECRET })] : [])
	],
	callbacks: {
		session({ session, user }) {
			session.user.id = user.id;
			return session;
		}
	}
});
