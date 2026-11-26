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
	const practices = RESOURCES.practices;
	it('converts values and empties', () => {
		const { row, issues } = parseRow(practices, {
			week: '49', type: 'Yoga', title: ' Morning ', teacher: 'Mara', minutes: '45', published_on: '2026-12-01',
			starts_at: '2026-12-01T08:00', description: '', video_provider: 'youtube', video_id: ''
		});
		expect(issues).toEqual([]);
		expect(row).toEqual({
			week: 49, type: 'Yoga', title: 'Morning', teacher: 'Mara', minutes: 45, published_on: '2026-12-01',
			starts_at: '2026-12-01T08:00:00.000Z', description: '', video_provider: 'youtube', video_id: null
		});
	});
	it('reports missing and invalid fields', () => {
		const { issues } = parseRow(practices, { type: 'Podcast', minutes: 'ten', starts_at: 'tomorrow', video_provider: 'vimeo' });
		expect(issues.map((i) => i.path[0])).toEqual(['week', 'type', 'title', 'teacher', 'minutes', 'published_on', 'starts_at', 'video_provider']);
		const moon = parseRow(RESOURCES.moon_themes, { circle_on: '2026-12-09', theme: 'Seeds', join_url: 'javascript:alert(1)', video_provider: 'youtube' });
		expect(moon.issues.map((i) => i.path[0])).toEqual(['join_url']);
	});
	it('splits lists', () => {
		expect(parseRow(RESOURCES.courses, { colors: '#111, #222' }).row.colors).toEqual(['#111', '#222']);
	});
});
