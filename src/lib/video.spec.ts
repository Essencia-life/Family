import { describe, expect, it } from 'vitest';
import { embedUrl } from './video';

describe('embedUrl', () => {
	it('builds a privacy-friendly YouTube embed', () => {
		expect(embedUrl({ video_provider: 'youtube', video_id: 'abc_123' })).toBe(
			'https://www.youtube-nocookie.com/embed/abc_123?rel=0'
		);
	});
	it('returns null when there is no video yet', () => {
		expect(embedUrl({ video_provider: 'youtube', video_id: null })).toBeNull();
	});
	it('refuses unknown providers', () => {
		expect(() => embedUrl({ video_provider: 'nope', video_id: 'x' })).toThrow('Unknown video provider');
	});
});
