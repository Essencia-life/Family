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
		db.from('moon_themes').select('theme, invitation').eq('circle_on', next).maybeSingle()
	]);
	return { next, later, going: !!must(rsvp), theme: must(theme) };
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

const LIVE = 'id, title, host, starts_at, minutes, description, join_url, video_provider, video_id';

/** Upcoming live sessions (including one running now) and the recordings of past ones. */
export const getLiveSessions = query(async () => {
	await requireMember();
	// A session counts as upcoming until 3 hours after it started; long enough for any session.
	const cutoff = new Date(Date.now() - 3 * 3600e3).toISOString();
	const [upcoming, past] = await Promise.all([
		db.from('live_sessions').select(LIVE).gte('starts_at', cutoff).order('starts_at').limit(4),
		db.from('live_sessions').select(LIVE).lt('starts_at', cutoff).order('starts_at', { ascending: false }).limit(12)
	]);
	return { upcoming: must(upcoming), recordings: must(past) };
});

export const getLiveSession = query(v.pipe(v.string(), v.uuid()), async (id) => {
	await requireMember();
	const session = must(await db.from('live_sessions').select(LIVE).eq('id', id).maybeSingle());
	if (!session) error(404, 'Session not found');
	return session;
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
