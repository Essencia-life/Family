import { error } from '@sveltejs/kit';
import { getRequestEvent } from '$app/server';
import { MAINTAINER_DOMAINS } from '$app/env/private';

export type Member = { id: string; name: string; email: string; maintainer: boolean };

/** Accounts on the team's email domains maintain the content. Login (magic link or Google) proves the address. */
export function isMaintainer(email: string | null | undefined) {
	const domain = email?.split('@').pop()?.toLowerCase();
	return !!domain && MAINTAINER_DOMAINS.includes(domain);
}

/** Throws 401 unless a member is signed in. Call it first in every member-only remote function. */
export async function requireMember(): Promise<Member> {
	const session = await getRequestEvent().locals.auth();
	const user = session?.user;
	if (!user?.id) error(401, 'Please sign in');
	// shortcut: every signed-in person counts as a member until payments exist; then check public.memberships here
	// and let maintainers through without one.
	return {
		id: user.id,
		name: user.name || user.email?.split('@')[0] || 'Member',
		email: user.email ?? '',
		maintainer: isMaintainer(user.email)
	};
}

/** Throws 403 unless the signed-in person is a maintainer. Call it first in every admin remote function. */
export async function requireMaintainer(): Promise<Member> {
	const member = await requireMember();
	if (!member.maintainer) error(403, 'Only maintainers can do this');
	return member;
}
