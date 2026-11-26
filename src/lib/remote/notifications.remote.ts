import { command, query } from '$app/server';
import { groupNews } from '#lib/notifications.ts';
import { db, must } from '#lib/server/db.ts';
import { requireMember } from '#lib/server/guard.ts';

/** What is new since the member last opened the bell, grouped by kind. */
export const getNotifications = query(async () => {
	const member = await requireMember();
	const seen = must(await db.from('notifications_seen').select('seen_at').eq('user_id', member.id).maybeSingle());
	const since = seen?.seen_at ?? new Date(Date.now() - 14 * 864e5).toISOString();
	const [practices, courses, recordings, threads, replies] = await Promise.all([
		db.from('practices').select('title').gt('created_at', since),
		db.from('courses').select('title').gt('created_at', since),
		db.from('recordings').select('title').gt('created_at', since),
		db.from('threads').select('id').gt('created_at', since).neq('author_id', member.id),
		db
			.from('replies')
			.select('thread_id, author_name, threads!inner(title)')
			.gt('created_at', since)
			.neq('author_id', member.id)
			.eq('threads.author_id', member.id)
	]);
	const items = groupNews({
		practices: must(practices),
		courses: must(courses),
		recordings: must(recordings),
		threads: must(threads),
		replies: must(replies).map(({ threads, ...r }) => ({ ...r, title: (threads as unknown as { title: string }).title }))
	});
	return { items, total: items.reduce((n, i) => n + i.count, 0) };
});

/** Called when the member opens the bell: from now on only newer things count. */
export const markNotificationsSeen = command(async () => {
	const member = await requireMember();
	must(await db.from('notifications_seen').upsert({ user_id: member.id, seen_at: new Date().toISOString() }));
});
