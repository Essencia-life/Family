import { describe, expect, it } from 'vitest';
import { greeting } from './greeting.ts';

describe('greeting', () => {
	const at = new Date('2026-11-26T16:00:00Z');
	it('uses the given time zone', () => {
		expect(greeting('America/Los_Angeles', at)).toBe('Good morning');
		expect(greeting('Europe/Lisbon', at)).toBe('Good afternoon');
		expect(greeting('Asia/Tokyo', at)).toBe('Good evening');
	});
	it('falls back to Lisbon for an unknown zone', () => {
		expect(greeting('Not/AZone', at)).toBe('Good afternoon');
	});
});
