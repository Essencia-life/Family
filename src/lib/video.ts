/** A video as stored in the database: which provider hosts it, and its id there. */
export type Video = { video_provider: string; video_id: string | null };
/** A preview image. Letterboxed ones have black bars around a 16:9 picture that the page crops away. */
export type Thumbnail = { url: string; letterboxed: boolean };

// No YouTube controls, keyboard, annotations or related videos: Player.svelte draws its own controls on top.
const YOUTUBE_PARAMS = 'rel=0&controls=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1&enablejsapi=1';

// To switch or add a host, add an entry here and set `video_provider` on the rows that use it.
const providers: Record<string, { embed: (id: string) => string; thumbnails: (id: string) => Thumbnail[] }> = {
	youtube: {
		embed: (id) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?${YOUTUBE_PARAMS}`,
		// maxresdefault is sharp but missing on some videos; hqdefault always exists.
		thumbnails: (id) => [
			{ url: `https://i.ytimg.com/vi/${encodeURIComponent(id)}/maxresdefault.jpg`, letterboxed: false },
			{ url: `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`, letterboxed: true }
		]
	}
};

function provider({ video_provider }: Video) {
	const p = providers[video_provider];
	if (!p) throw new Error(`Unknown video provider: ${video_provider}`);
	return p;
}

/** The iframe URL for a video, or null while it has no id yet. */
export function embedUrl(video: Video): string | null {
	return video.video_id ? provider(video).embed(video.video_id) : null;
}

/** Preview images for a video, best first, or none while it has no id yet. */
export function thumbnails(video: Partial<Video> | null | undefined): Thumbnail[] {
	return video?.video_id && video.video_provider ? provider(video as Video).thumbnails(video.video_id) : [];
}
