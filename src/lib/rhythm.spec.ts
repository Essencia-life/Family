import { describe, expect, it } from 'vitest';
import { rhythm } from './rhythm';

describe('rhythm', () => {
	it('marks the days practised this week and counts mornings this month', () => {
		const now = Date.UTC(2026, 10, 26, 10); // Thursday
		const r = rhythm(['2026-11-26T08:00:00Z', '2026-11-26T09:00:00Z', '2026-11-24T23:30:00Z', '2026-10-31T08:00:00Z'], now);
		expect(r.week.map((d) => d.label).join()).toBe('Fr,Sa,Su,Mo,Tu,We,Th');
		expect(r.week.map((d) => d.on)).toEqual([false, false, false, false, true, false, true]);
		expect(r.week[6].today).toBe(true);
		expect(r.thisMonth).toBe(2);
	});
});
