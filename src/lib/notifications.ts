// Groups what is new since the member last opened the bell into one line per kind. Shared by server and browser.
export type News = {
	practices: { title: string }[];
	courses: { title: string }[];
	recordings: { title: string }[];
	/** New posts by other members. */
	threads: unknown[];
	/** Replies by others to the member's own posts. */
	replies: { thread_id: string; author_name: string; title: string }[];
};
export type NewsItem = { key: string; text: string; href: string; count: number };

const plural = (n: number, one: string, many = one + 's') => `${n} new ${n === 1 ? one : many}`;
const countBy = <T>(list: T[], key: (t: T) => string) =>
	list.reduce((m, t) => m.set(key(t), [...(m.get(key(t)) ?? []), t]), new Map<string, T[]>());

export function groupNews(news: News): NewsItem[] {
	const items: NewsItem[] = [];
	for (const [thread, replies] of countBy(news.replies, (r) => r.thread_id)) {
		const names = [...new Set(replies.map((r) => r.author_name))];
		const who = names.length === 1 ? names[0] : `${names[0]} and ${names.length - 1} other${names.length > 2 ? 's' : ''}`;
		items.push({ key: `reply-${thread}`, text: `${who} replied to your post “${replies[0].title}”`, href: '/community#exchange', count: replies.length });
	}
	const one = (key: string, list: { title: string }[], label: string, href: string) => {
		if (list.length)
			items.push({ key, text: list.length === 1 ? `New ${label}: ${list[0].title}` : plural(list.length, label), href, count: list.length });
	};
	one('practices', news.practices, 'morning practice', '/practice');
	one('courses', news.courses, 'course', '/courses');
	one('recordings', news.recordings, 'recording', '/community');
	if (news.threads.length)
		items.push({ key: 'threads', text: `${plural(news.threads.length, 'post')} in the exchange`, href: '/community#exchange', count: news.threads.length });
	return items;
}
