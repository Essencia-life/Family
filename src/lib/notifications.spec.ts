import { describe, expect, it } from 'vitest';
import { groupNews } from './notifications';

describe('groupNews', () => {
	it('puts replies first, then one line per practice type, course, recording and exchange posts', () => {
		const items = groupNews({
			practices: [{ type: 'Yoga' }, { type: 'Yoga' }, { type: 'Breathwork' }],
			courses: [{ title: 'Roots' }],
			recordings: [{ title: 'A' }, { title: 'B' }],
			threads: [{}, {}, {}],
			replies: [
				{ thread_id: 't1', author_name: 'Ana', title: 'Hello' },
				{ thread_id: 't1', author_name: 'Rui', title: 'Hello' },
				{ thread_id: 't1', author_name: 'Ana', title: 'Hello' }
			]
		});
		expect(items.map((i) => i.text)).toEqual([
			'Ana and 1 other replied to your post “Hello”',
			'2 new Yoga practices',
			'1 new Breathwork practice',
			'New course: Roots',
			'2 new recordings',
			'3 new posts in the exchange'
		]);
		expect(items.reduce((n, i) => n + i.count, 0)).toBe(12);
	});

	it('is empty when nothing is new', () => {
		expect(groupNews({ practices: [], courses: [], recordings: [], threads: [], replies: [] })).toEqual([]);
	});
});
