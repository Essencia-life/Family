import { describe, expect, it } from 'vitest';
import { isoToLisbon, lisbonToIso, parseRow, RESOURCES } from './admin';

describe('Lisbon time', () => {
	it('handles winter (UTC) and summer (UTC+1)', () => {
		expect(lisbonToIso('2026-12-01T08:00')).toBe('2026-12-01T08:00:00.000Z');
		expect(lisbonToIso('2026-07-01T08:00')).toBe('2026-07-01T07:00:00.000Z');
		expect(isoToLisbon('2026-07-01T07:00:00.000Z')).toBe('2026-07-01T08:00');
	});
});

describe('parseRow', () => {
	const live = RESOURCES.live_sessions;
	it('converts values and empties', () => {
		const { row, issues } = parseRow(live, {
			kind: 'Morning practice', title: ' Morning ', host: 'Mara', starts_at: '2026-12-01T08:00', minutes: '60',
			description: '', join_url: '', video_provider: 'youtube', video_id: ''
		});
		expect(issues).toEqual([]);
		expect(row).toEqual({
			kind: 'Morning practice', title: 'Morning', host: 'Mara', starts_at: '2026-12-01T08:00:00.000Z', minutes: 60,
			description: '', join_url: null, video_provider: 'youtube', video_id: null
		});
	});
	it('reports missing and invalid fields', () => {
		const { issues } = parseRow(live, { kind: 'Podcast', minutes: 'ten', join_url: 'javascript:alert(1)', video_provider: 'vimeo' });
		expect(issues.map((i) => i.path[0])).toEqual(['kind', 'title', 'host', 'starts_at', 'minutes', 'join_url', 'video_provider']);
	});
	it('splits lists', () => {
		expect(parseRow(RESOURCES.courses, { colors: '#111, #222' }).row.colors).toEqual(['#111', '#222']);
	});
});
