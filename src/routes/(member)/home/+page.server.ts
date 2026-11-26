import { redirect } from '@sveltejs/kit';

// The member home now lives at the root; keep old links working.
export const load = () => redirect(308, '/');
