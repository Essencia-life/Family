/** A video as stored in the database: which provider hosts it, and its id there. */
export type Video = { video_provider: string; video_id: string | null };

// To switch or add a host, add an entry here and set `video_provider` on the rows that use it.
const providers: Record<string, (id: string) => string> = {
	youtube: (id) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`
};

/** The iframe URL for a video, or null while it has no id yet. */
export function embedUrl({ video_provider, video_id }: Video): string | null {
	if (!video_id) return null;
	const provider = providers[video_provider];
	if (!provider) throw new Error(`Unknown video provider: ${video_provider}`);
	return provider(video_id);
}
