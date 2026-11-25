import { form, query } from '$app/server';
import * as v from 'valibot';
import { db, must } from '#lib/server/db.ts';
import { requireMember } from '#lib/server/guard.ts';

export const getAccount = query(async () => {
	const member = await requireMember();
	const membership = must(
		await db.from('memberships').select('plan, status, renews_on').eq('user_id', member.id).maybeSingle()
	);
	return { ...member, membership };
});

export const updateName = form(
	v.object({ name: v.pipe(v.string(), v.trim(), v.nonEmpty('Please enter your name'), v.maxLength(100)) }),
	async ({ name }) => {
		const member = await requireMember();
		must(await db.schema('next_auth').from('users').update({ name }).eq('id', member.id));
		await getAccount().refresh();
		return { saved: true };
	}
);
