import { describe, expect, it } from 'vitest';
import { groupNews } from './notifications';

describe('groupNews', () => {
	it('puts replies first, then one line each for practices, courses, recordings and exchange posts', () => {
		const items = groupNews({
			practices: [{ title: 'Sun' }, { title: 'Breath' }, { title: 'Flow' }],
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
			'3 new morning practices',
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
