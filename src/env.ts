import { defineEnvVars } from '@sveltejs/kit/env';

const optional = (value: string | undefined) => value || undefined;

export const variables = defineEnvVars({
	SUPABASE_URL: { description: 'Supabase project URL' },
	SUPABASE_SERVICE_ROLE_KEY: { description: 'Supabase service role key. Server only, never expose it.' },
	AUTH_SECRET: { description: 'Random string of at least 32 characters, e.g. `openssl rand -hex 32`' },
	AUTH_GOOGLE_ID: { schema: optional, description: 'Google OAuth client id. Leave empty to hide Google login.' },
	AUTH_GOOGLE_SECRET: { schema: optional, description: 'Google OAuth client secret' },
	AUTH_RESEND_KEY: { schema: optional, description: 'Resend API key for email magic links. Leave empty to hide email login.' },
	AUTH_EMAIL_FROM: { schema: optional, description: 'Sender address for magic links, e.g. "Essência Family <family@essencia.life>"' }
});
