import { describe, expect, it } from 'vitest';
import { formatDay, nextNewMoons } from './moon';

describe('nextNewMoons', () => {
	it('finds the new moon after a date, about a month apart', () => {
		// Real new moon: 1 Dec 2024, 06:21 UTC.
		const [first, second] = nextNewMoons(2, Date.UTC(2024, 10, 20));
		expect(first).toBe('2024-12-01');
		expect(second).toBe('2024-12-30');
	});
	it('formats a day for people', () => {
		expect(formatDay('2024-12-01')).toMatch(/^Sunday,? 1 December$/);
	});
});
