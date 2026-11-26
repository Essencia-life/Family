<script lang="ts">
	import { onMount } from 'svelte';
	import { gradient } from '#lib/content.ts';
	import { embedUrl, thumbnails, type Video } from '#lib/video.ts';
	import { loadYouTube, type YTPlayer } from '#lib/youtube.ts';
	import Cover from './Cover.svelte';
	import PlayIcon from './PlayIcon.svelte';

	let { video, title, colors, svg }: { video: Video; title: string; colors: readonly string[]; svg: string } = $props();
	const src = $derived(embedUrl(video));
	// Our own controls sit over YouTube's player, so its title, logo, share links and suggestions can't be clicked.
	const custom = $derived(video.video_provider === 'youtube');

	let stage: HTMLDivElement;
	let iframe = $state<HTMLIFrameElement>();
	let player: YTPlayer | undefined;
	let ready = $state(false);
	let started = $state(false);
	let playing = $state(false);
	let ended = $state(false);
	let muted = $state(false);
	let time = $state(0);
	let duration = $state(0);
	let fullscreen = $state(false);
	let canFullscreen = $state(false);

	onMount(() => {
		canFullscreen = document.fullscreenEnabled;
		const onFs = () => (fullscreen = document.fullscreenElement === stage);
		document.addEventListener('fullscreenchange', onFs);
		if (custom && iframe) {
			loadYouTube()
				.then((YT) => {
					player = new YT.Player(iframe!, {
						events: {
							onReady: () => {
								ready = true;
								duration = player!.getDuration();
							},
							onStateChange: ({ data }) => {
								playing = data === 1;
								ended = data === 0;
								if (data === 1) started = true;
								duration = player!.getDuration();
							}
						}
					});
				})
				// Without the API the middle of the video still starts it; only our controls are missing.
				.catch(() => {});
		}
		return () => {
			document.removeEventListener('fullscreenchange', onFs);
			player?.destroy();
		};
	});

	$effect(() => {
		if (!playing) return;
		const t = setInterval(() => (time = player?.getCurrentTime() ?? 0), 250);
		return () => clearInterval(t);
	});

	const toggle = () => (playing ? player?.pauseVideo() : player?.playVideo());
	const seek = (s: number) => {
		time = s;
		player?.seekTo(s, true);
	};
	const toggleMute = () => {
		if (!player) return;
		muted ? player.unMute() : player.mute();
		muted = !muted;
	};
	const toggleFullscreen = () => (fullscreen ? document.exitFullscreen() : stage.requestFullscreen());
	const fmt = (s: number) => {
		s = Math.floor(s);
		const h = Math.floor(s / 3600);
		const m = Math.floor((s % 3600) / 60);
		const ss = String(s % 60).padStart(2, '0');
		return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
	};
</script>

<div class="stage">
	<div class="glowbg" style={gradient(colors)}></div>
	<div class="video" class:fs={fullscreen} style={gradient(colors)} bind:this={stage}>
		{#if src}
			<!-- Poster while YouTube loads; the iframe paints over it once ready. -->
			<Cover thumbs={thumbnails(video)} />
			<iframe
				bind:this={iframe}
				{src}
				{title}
				allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
				referrerpolicy="strict-origin-when-cross-origin"
			></iframe>
			{#if custom}
				{#if !started}
					<!-- Before the first play, taps in the middle reach YouTube itself (iOS only starts playback that way);
					     the bands hide and block its title bar and logo. -->
					<div class="shield top-0 h-[24%] bg-gradient-to-b from-black/90 to-black/0"></div>
					<div class="shield bottom-0 h-[22%] bg-gradient-to-t from-black/90 to-black/0"></div>
				{:else}
					<button class="shield inset-0 cursor-pointer" aria-label={playing ? 'Pause' : 'Play'} onclick={toggle}>
						{#if ended}
							<Cover thumbs={thumbnails(video)} />
						{/if}
						{#if !playing}
							<span class="absolute inset-0 flex items-center justify-center bg-black/55">
								<span class="bigplay"><PlayIcon size={30} /></span>
							</span>
						{/if}
					</button>
					{#if ready}
						<div class="controls">
							<button aria-label={playing ? 'Pause' : 'Play'} onclick={toggle}>
								{#if playing}
									<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
								{:else}
									<PlayIcon size={16} />
								{/if}
							</button>
							<span class="tabular-nums">{fmt(time)} / {fmt(duration)}</span>
							<input
								type="range"
								class="flex-1 accent-glow"
								aria-label="Position"
								min="0"
								max={duration || 1}
								step="1"
								value={time}
								oninput={(e) => seek(+e.currentTarget.value)}
							/>
							<button aria-label={muted ? 'Unmute' : 'Mute'} onclick={toggleMute}>
								<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
									<path d="M4 9h4l5-5v16l-5-5H4z" />
									{#if muted}<path d="M16 9l5 6M21 9l-5 6" stroke="currentColor" stroke-width="2" />{:else}<path d="M16 8a5 5 0 010 8" fill="none" stroke="currentColor" stroke-width="2" />{/if}
								</svg>
							</button>
							{#if canFullscreen}
								<button aria-label={fullscreen ? 'Exit full screen' : 'Full screen'} onclick={toggleFullscreen}>
									<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
								</button>
							{/if}
						</div>
					{/if}
				{/if}
			{/if}
		{:else}
			<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{@html svg}</svg>
			<div class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-stone">
				<span class="bigplay"><PlayIcon size={30} /></span>
				<span class="text-[0.8rem] opacity-85">Video coming soon</span>
			</div>
		{/if}
	</div>
</div>
