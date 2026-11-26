import { error } from '@sveltejs/kit';
import { command, form, query } from '$app/server';
import * as v from 'valibot';
import { THREAD_CATEGORIES } from '#lib/content.ts';
import { nextNewMoons } from '#lib/moon.ts';
import { db, must } from '#lib/server/db.ts';
import { requireMember } from '#lib/server/guard.ts';

const text = (max: number) => v.pipe(v.string(), v.trim(), v.nonEmpty('Please write something'), v.maxLength(max));

export const getCircles = query(async () => {
	const member = await requireMember();
	const [next, ...later] = nextNewMoons(3);
	const [rsvp, theme] = await Promise.all([
		db.from('circle_rsvps').select('circle_on').eq('user_id', member.id).eq('circle_on', next).maybeSingle(),
		db.from('moon_themes').select('theme, invitation, starts_at, join_url').eq('circle_on', next).maybeSingle()
	]);
	return { next, later, going: !!must(rsvp), theme: must(theme) };
});

/** Past new moon meetings that have a recording, newest first. */
export const getMoonRecordings = query(async () => {
	await requireMember();
	return must(
		await db
			.from('moon_themes')
			.select('circle_on, theme, invitation, video_provider, video_id')
			.not('video_id', 'is', null)
			.lt('circle_on', new Date().toISOString().slice(0, 10))
			.order('circle_on', { ascending: false })
	);
});

export const getMoonRecording = query(v.string(), async (date) => {
	const recording = (await getMoonRecordings()).find((m) => m.circle_on === date);
	if (!recording) error(404, 'Recording not found');
	return recording;
});

export const setGoing = command(v.boolean(), async (going) => {
	const member = await requireMember();
	const row = { user_id: member.id, circle_on: nextNewMoons(1)[0] };
	must(
		going
			? await db.from('circle_rsvps').upsert(row, { ignoreDuplicates: true })
			: await db.from('circle_rsvps').delete().match(row)
	);
	await getCircles().refresh();
});

export const getThreads = query(async () => {
	await requireMember();
	return must(
		await db
			.from('threads')
			.select('id, category, title, body, author_name, created_at, replies(id, author_name, body, created_at)')
			.order('created_at', { ascending: false })
			.order('created_at', { referencedTable: 'replies' })
	);
});

export const createThread = form(
	v.object({ category: v.picklist(THREAD_CATEGORIES), title: text(200), body: text(5000) }),
	async ({ category, title, body }) => {
		const member = await requireMember();
		must(
			await db.from('threads').insert({ category, title, body, author_id: member.id, author_name: member.name })
		);
		await getThreads().refresh();
	}
);

export const replyToThread = form(
	v.object({ threadId: v.pipe(v.string(), v.uuid()), body: text(5000) }),
	async ({ threadId, body }) => {
		const member = await requireMember();
		must(
			await db
				.from('replies')
				.insert({ thread_id: threadId, body, author_id: member.id, author_name: member.name })
		);
		await getThreads().refresh();
	}
);
