import { error, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// Page-level gate. The data itself is protected by requireMaintainer() in admin.remote.ts.
export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { session, maintainer } = await parent();
	if (!session?.user) redirect(303, `/login?callbackUrl=${encodeURIComponent(url.pathname)}`);
	if (!maintainer) error(403, 'The back-office is only for the Essência team');
};
