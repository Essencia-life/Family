import { describe, expect, it } from 'vitest';
import { embedUrl, thumbnailUrl } from './video';

describe('embedUrl', () => {
	it('builds a privacy-friendly YouTube embed', () => {
		expect(embedUrl({ video_provider: 'youtube', video_id: 'abc_123' })).toBe(
			'https://www.youtube-nocookie.com/embed/abc_123?rel=0'
		);
	});
	it('returns null when there is no video yet', () => {
		expect(embedUrl({ video_provider: 'youtube', video_id: null })).toBeNull();
	});
	it('builds the YouTube thumbnail, or null without a video', () => {
		expect(thumbnailUrl({ video_provider: 'youtube', video_id: 'abc_123' })).toBe('https://i.ytimg.com/vi/abc_123/hqdefault.jpg');
		expect(thumbnailUrl({ video_provider: 'youtube', video_id: null })).toBeNull();
		expect(thumbnailUrl(undefined)).toBeNull();
	});
	it('refuses unknown providers', () => {
		expect(() => embedUrl({ video_provider: 'nope', video_id: 'x' })).toThrow('Unknown video provider');
	});
});
