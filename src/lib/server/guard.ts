import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';

export type Member = { id: string; name: string; email: string };

/** Throws 401 unless a member is signed in. Call it first in every member-only remote function. */
export async function requireMember(): Promise<Member> {
	const session = await getRequestEvent().locals.auth();
	const user = session?.user;
	if (!user?.id) error(401, 'Please sign in');
	// shortcut: every signed-in person counts as a member until payments exist; then check public.memberships here.
	return { id: user.id, name: user.name || user.email?.split('@')[0] || 'Member', email: user.email ?? '' };
}
