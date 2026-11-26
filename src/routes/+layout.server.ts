import { isMaintainer } from '#lib/server/guard.ts';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	const session = await locals.auth();
	return { session, maintainer: isMaintainer(session?.user?.email), tz: cookies.get('tz') };
};
