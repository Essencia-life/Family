import { redirect } from '@sveltejs/kit';
import { providerIds, signIn } from '../../auth.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, url }) => {
	// Only same-site targets, so a crafted link can't send people elsewhere after login.
	const target = new URL(url.searchParams.get('callbackUrl') ?? '/', url);
	const next = target.origin === url.origin ? target.pathname + target.search : '/';
	const { session } = await parent();
	if (session?.user) redirect(303, next);
	return { providers: providerIds, next, error: url.searchParams.get('error') };
};

export const actions: Actions = { default: signIn };
