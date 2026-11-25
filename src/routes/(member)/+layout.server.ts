import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Page-level redirect for people who are not signed in. The data itself is protected in each remote function.
export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { session } = await parent();
	if (!session?.user) redirect(303, `/auth/signin?callbackUrl=${encodeURIComponent(url.pathname)}`);
};
