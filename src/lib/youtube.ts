// Minimal typing for the parts of the YouTube IFrame API that Player.svelte uses.
export type YTPlayer = {
	playVideo(): void;
	pauseVideo(): void;
	seekTo(seconds: number, allowSeekAhead: boolean): void;
	getCurrentTime(): number;
	getDuration(): number;
	mute(): void;
	unMute(): void;
	isMuted(): boolean;
	destroy(): void;
};
type YT = {
	Player: new (el: HTMLIFrameElement, opts: { events: { onReady?: () => void; onStateChange?: (e: { data: number }) => void } }) => YTPlayer;
};

declare global {
	interface Window {
		YT?: YT;
		onYouTubeIframeAPIReady?: () => void;
	}
}

let api: Promise<YT> | undefined;

/** Loads the YouTube IFrame API once per page. */
export function loadYouTube(): Promise<YT> {
	return (api ??= new Promise((resolve, reject) => {
		if (window.YT?.Player) return resolve(window.YT);
		const prev = window.onYouTubeIframeAPIReady;
		window.onYouTubeIframeAPIReady = () => {
			prev?.();
			resolve(window.YT!);
		};
		const s = document.createElement('script');
		s.src = 'https://www.youtube.com/iframe_api';
		s.onerror = () => {
			api = undefined;
			reject(new Error('YouTube API failed to load'));
		};
		document.head.append(s);
	}));
}
