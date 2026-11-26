<script lang="ts">
	import { page } from '$app/state';
	import { ART, THREAD_CATEGORIES } from '#lib/content.ts';
	import { formatDay } from '#lib/moon.ts';
	import Moon from '#lib/components/Moon.svelte';
	import PlayIcon from '#lib/components/PlayIcon.svelte';
	import Thumb from '#lib/components/Thumb.svelte';
	import {
		createThread,
		getCircles,
		getMoonRecordings,
		getThreads,
		replyToThread,
		setGoing
	} from '#lib/remote/community.remote.ts';
	import { getRecordings } from '#lib/remote/content.remote.ts';

	const [circles, moon, recordings, threads] = $derived(
		await Promise.all([getCircles(), getMoonRecordings(), getRecordings(), getThreads()])
	);
	let writing = $state(false);
	let topic = $state<string>('All');
	const shown = $derived(topic === 'All' ? threads : threads.filter((t) => t.category === topic));
	const me = $derived(page.data.session?.user?.name || 'You');
	// A stable soft colour per name for the initial avatars.
	const hue = (name: string) => `a${[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % 5}`;
	const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
	const ago = (iso: string) => {
		const days = Math.round((Date.parse(iso) - Date.now()) / 864e5);
		if (days <= -7) return date(iso);
		if (days < 0) return rtf.format(days, 'day');
		const hours = Math.round((Date.parse(iso) - Date.now()) / 36e5);
		return hours < 0 ? rtf.format(hours, 'hour') : 'just now';
	};

	function shareReflection() {
		writing = true;
		createThread.fields.category.set('New moon reflections');
		topic = 'All';
		document.getElementById('exchange')?.scrollIntoView({ behavior: 'smooth' });
	}
	const daysTo = (day: string) => Math.max(0, Math.round((Date.parse(day + 'T19:00:00Z') - Date.now()) / 864e5));
	const time = (iso: string) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' });
	const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<div class="py-10">
	<div class="wrap">
		<p class="eyebrow mb-2">Community</p>
		<h1 class="display mb-3 text-4xl md:text-5xl">Come <span class="accent">together.</span></h1>
		<p class="muted mb-8">Practise live, share what you experience, and support each other between sessions.</p>

		<div
			class="relative grid items-center gap-6 overflow-hidden p-8 md:grid-cols-[1fr_300px] md:p-12"
			style="border-radius:34px 10px 34px 10px;background:linear-gradient(160deg,#0c1822,#1d3a44 60%,#2b4a3a);border:1px solid rgba(252,250,244,.14);"
		>
			<div>
				<span class="chip">New moon check-in · monthly</span>
				<p class="display mt-4 text-4xl md:text-5xl">{formatDay(circles.next)}</p>
				<p class="mt-2 mb-1 font-accent text-[1.4rem] text-glow italic">
					{daysTo(circles.next) ? `in ${daysTo(circles.next)} day${daysTo(circles.next) > 1 ? 's' : ''}` : 'tonight'}
				</p>
				<!-- Without a planned time, 19:00 comes from the prototype. -->
				<p class="muted mb-6">{circles.theme?.starts_at ? time(circles.theme.starts_at) : '19:00'} Lisbon time · live on video</p>
				{#if circles.theme}
					<p class="display text-xl">This month's theme: {circles.theme.theme}</p>
					<p class="mt-1 mb-4 max-w-xl font-accent text-[1.15rem] text-stone/85 italic">{circles.theme.invitation}</p>
				{/if}
				<p class="muted mb-6 max-w-xl text-[0.85rem]">
					We look back on what we experienced, share a theme and intention for the coming month, and bring practices, rituals or knowledge around it.
				</p>
				<div class="flex flex-wrap items-center gap-3">
					<button class="btn btn-amber" disabled={setGoing.pending > 0} onclick={() => setGoing(!circles.going)}>
						{circles.going ? "✓ You're coming" : "I'll be there"}
					</button>
					{#if circles.theme?.join_url}
						<a href={circles.theme.join_url} class="btn btn-light" target="_blank" rel="noopener">Join the meeting &nearr;</a>
					{/if}
					<button class="btn btn-ghost" onclick={shareReflection}>Share your reflection</button>
				</div>
				<p class="muted mt-6 text-[0.8rem]">Then: {circles.later.map(formatDay).join(' and ')}</p>
			</div>
			<div class="moonwrap flex justify-center"><Moon size={260} /></div>
		</div>

		{#if moon.length}
		<h2 class="display mt-14 mb-4 text-2xl md:text-3xl">New moon recordings</h2>
		<div class="grid gap-5 md:grid-cols-3">
			{#each moon as m (m.circle_on)}
				<a href="/community/moon/{m.circle_on}" class="card">
					<Thumb colors={ART.Meditation.colors} svg={ART.Meditation.svg} video={m}>
						<span class="chip on-img">New moon</span><span class="play"><PlayIcon /></span>
					</Thumb>
					<p class="meta">{formatDay(m.circle_on)}</p>
					<p class="ttl">{m.theme}</p>
				</a>
			{/each}
		</div>
		{/if}

		{#if recordings.length}
		<h2 class="display mt-14 mb-4 text-2xl md:text-3xl">ZEGG Forum recordings</h2>
		<div class="grid gap-5 md:grid-cols-3">
			{#each recordings as r (r.slug)}
				<a href="/community/recordings/{r.slug}" class="card">
					<Thumb colors={ART.Forum.colors} svg={ART.Forum.svg} video={r}>
						<span class="chip on-img">Forum</span><span class="play"><PlayIcon /></span>
					</Thumb>
					<p class="meta">{date(r.recorded_on)} · {r.minutes} min</p>
					<p class="ttl">{r.title}</p>
				</a>
			{/each}
		</div>
		{/if}

		<div id="exchange" class="mt-14 mb-2 scroll-mt-20">
			<h2 class="display text-2xl md:text-3xl">The <span class="accent">exchange.</span></h2>
		</div>
		<p class="muted mb-5 text-[0.88rem]">What did you notice in practice? What are you learning? Ask, answer and encourage each other.</p>

		<div class="mb-4 flex flex-wrap gap-2">
			{#each ['All', ...THREAD_CATEGORIES] as c (c)}
				<button class="pill" aria-pressed={topic === c} onclick={() => (topic = c)}>{c}</button>
			{/each}
		</div>

		{#if writing}
			<form
				class="glass mb-4 flex flex-col gap-3"
				{...createThread.enhance(async ({ submit, element }) => {
					if (await submit()) {
						element.reset();
						writing = false;
					}
				})}
			>
				<select class="field" {...createThread.fields.category.as('select')}>
					{#each THREAD_CATEGORIES as c (c)}<option>{c}</option>{/each}
				</select>
				<input class="field" placeholder="Title" {...createThread.fields.title.as('text')} />
				{#each createThread.fields.title.issues() ?? [] as issue (issue.message)}<p class="issue">{issue.message}</p>{/each}
				<textarea class="field" rows="3" placeholder="What is on your mind?" {...createThread.fields.body.as('text')}></textarea>
				{#each createThread.fields.body.issues() ?? [] as issue (issue.message)}<p class="issue">{issue.message}</p>{/each}
				<div class="flex gap-2">
					<button class="btn btn-amber btn-sm" disabled={createThread.pending > 0}>Post</button>
					<button type="button" class="btn btn-ghost btn-sm" onclick={() => (writing = false)}>Cancel</button>
				</div>
			</form>
		{:else}
			<button class="glass compose mb-4" onclick={() => (writing = true)}>
				<span class="av {hue(me)}">{me[0]}</span>
				<span class="flex-1 text-left font-accent text-[1.2rem] text-ink/50 italic">What is on your mind today?</span>
				<span class="btn btn-amber btn-sm">Share</span>
			</button>
		{/if}

		<div class="grid gap-4 md:grid-cols-2">
			{#each shown as t (t.id)}
				{@const reply = replyToThread.for(t.id)}
				{@const last = t.replies.at(-1)}
				<details class="glass post">
					<summary class="flex flex-col gap-3">
						<span class="flex items-center gap-3">
							<span class="av {hue(t.author_name)}">{t.author_name[0]}</span>
							<span class="flex flex-col">
								<b class="display text-[0.95rem] text-stone">{t.author_name}</b>
								<span class="muted text-[0.72rem]">{ago(t.created_at)}</span>
							</span>
							<span class="chip ml-auto">{t.category}</span>
						</span>
						<span class="display text-[1.3rem] text-stone">{t.title}</span>
						<span class="excerpt muted text-[0.9rem] leading-[1.65] whitespace-pre-line">{t.body}</span>
						<span class="last mt-auto flex items-center gap-3 text-[0.78rem]">
							{#if last}
								<span class="flex">
									{#each [...new Set(t.replies.map((r) => r.author_name))].slice(0, 3) as name (name)}
										<span class="av sm {hue(name)}">{name[0]}</span>
									{/each}
								</span>
								<span class="muted line-clamp-1">
									{t.replies.length} {t.replies.length === 1 ? 'reply' : 'replies'} · {last.author_name}: “{last.body}”
								</span>
							{:else}
								<span class="muted italic">No replies yet · be the first</span>
							{/if}
						</span>
					</summary>
					{#each t.replies as r (r.id)}
						<p class="mt-3 border-l-2 border-amber/70 pl-4 text-[0.86rem] leading-[1.7] whitespace-pre-line">
							<b class="font-display text-stone">{r.author_name}</b>
							{r.body}
						</p>
					{/each}
					<form
						class="mt-4 flex gap-2"
						{...reply.enhance(async ({ submit, element }) => {
							if (await submit()) element.reset();
						})}
					>
						<input {...reply.fields.threadId.as('hidden', t.id)} />
						<input class="field flex-1" placeholder="Write a reply" aria-label="Reply" {...reply.fields.body.as('text')} />
						<button class="btn btn-amber btn-sm" disabled={reply.pending > 0}>Reply</button>
					</form>
				</details>
			{:else}
				<p class="muted italic">Nothing here yet. Start the first conversation.</p>
			{/each}
		</div>
	</div>
</div>

<style>
	.pill { font-size: 0.78rem; padding: 0.4rem 0.9rem; border-radius: 20px; border: 1px solid rgba(252, 250, 244, 0.18); color: rgba(239, 234, 219, 0.8); transition: all 0.2s; }
	.pill:hover { color: var(--color-stone); }
	.pill[aria-pressed='true'] { background: rgba(232, 180, 85, 0.16); border-color: rgba(232, 180, 85, 0.5); color: var(--color-glow); }
	.compose { display: flex; width: 100%; align-items: center; gap: 0.9rem; padding: 1rem 1.2rem; }
	.compose:hover { border-color: rgba(232, 180, 85, 0.4); }
	.post summary { list-style: none; cursor: pointer; }
	.post:not([open]) summary { height: 100%; }
	.post[open] .last { display: none; }
	.post summary::-webkit-details-marker { display: none; }
	.post:hover { border-color: rgba(232, 180, 85, 0.35); }
	/* An opened post spans the whole row and shows its full text. */
	.post[open] { grid-column: 1 / -1; }
	.post:not([open]) .excerpt { display: -webkit-box; -webkit-line-clamp: 3; line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
	.av { width: 34px; height: 34px; flex-shrink: 0; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; font: 700 0.8rem var(--font-display); color: #241a08; border: 2px solid var(--color-night); text-transform: uppercase; }
	.av.sm { width: 26px; height: 26px; font-size: 0.65rem; margin-left: -8px; }
	.av.sm:first-child { margin-left: 0; }
	.a0 { background: #e8b455; } .a1 { background: #9fb38a; } .a2 { background: #8fb6c2; } .a3 { background: #d9a68a; } .a4 { background: #c9b8e0; }
</style>
