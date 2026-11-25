import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from '$app/env/private';

// Service role client: bypasses RLS, so every remote function checks the user itself (see guard.ts).
export const db = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
	auth: { persistSession: false }
});

type Success<R> = R extends { error: null; data: infer D } ? D : never;

/** Unwraps a Supabase result, throwing on error. */
export function must<R extends { data: unknown; error: unknown }>(result: R): Success<R> {
	if (result.error) throw result.error;
	return result.data as Success<R>;
}
