import { describe, expect, it } from 'vitest';
import { embedUrl, thumbnails } from './video';

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
		expect(thumbnails({ video_provider: 'youtube', video_id: 'abc_123' }).map((t) => t.url)).toEqual([
			'https://i.ytimg.com/vi/abc_123/maxresdefault.jpg',
			'https://i.ytimg.com/vi/abc_123/hqdefault.jpg'
		]);
		expect(thumbnails({ video_provider: 'youtube', video_id: null })).toEqual([]);
		expect(thumbnails(undefined)).toEqual([]);
	});
	it('refuses unknown providers', () => {
		expect(() => embedUrl({ video_provider: 'nope', video_id: 'x' })).toThrow('Unknown video provider');
	});
});
