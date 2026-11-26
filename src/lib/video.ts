/** A video as stored in the database: which provider hosts it, and its id there. */
export type Video = { video_provider: string; video_id: string | null };

// To switch or add a host, add an entry here and set `video_provider` on the rows that use it.
const providers: Record<string, { embed: (id: string) => string; thumbnail: (id: string) => string }> = {
	youtube: {
		embed: (id) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`,
		thumbnail: (id) => `https://i.ytimg.com/vi/${encodeURIComponent(id)}/hqdefault.jpg`
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

/** The preview image for a video, or null while it has no id yet. */
export function thumbnailUrl(video: Partial<Video> | null | undefined): string | null {
	return video?.video_id && video.video_provider ? provider(video as Video).thumbnail(video.video_id) : null;
}
