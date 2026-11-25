<script lang="ts">
	import { ART, THREAD_CATEGORIES, formatSession } from '#lib/content.ts';
	import { formatDay } from '#lib/moon.ts';
	import PlayIcon from '#lib/components/PlayIcon.svelte';
	import Thumb from '#lib/components/Thumb.svelte';
	import {
		createThread,
		getCircles,
		getLiveSessions,
		getThreads,
		replyToThread,
		setGoing
	} from '#lib/remote/community.remote.ts';
	import { getRecordings } from '#lib/remote/content.remote.ts';

	const [circles, live, recordings, threads] = $derived(
		await Promise.all([getCircles(), getLiveSessions(), getRecordings(), getThreads()])
	);
	let writing = $state(false);

	function shareReflection() {
		writing = true;
		createThread.fields.category.set('New moon reflections');
		document.getElementById('exchange')?.scrollIntoView({ behavior: 'smooth' });
	}
	const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<div class="px-6 py-10">
	<div class="container">
		<p class="eyebrow mb-1">Community</p>
		<h1 class="h2 mb-2 text-3xl">Come together.</h1>
		<p class="mb-8 text-[0.92rem] opacity-70">Practise live, share what you experience, and support each other between sessions.</p>

		<h2 class="h2 mb-5 text-2xl">Live sessions</h2>
		<!-- Guess: the plan says two a week; days and times come from the live_sessions table. -->
		<div class="grid gap-3 md:grid-cols-2">
			{#each live.upcoming as s (s.id)}
				<a href="/live/{s.id}" class="card flex items-center gap-4 rounded-2xl border border-moss/20 bg-white/50 p-4">
					<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-stone"><PlayIcon /></span>
					<span>
						<span class="block font-display text-[0.62rem] font-bold tracking-[0.16em] text-moss uppercase">{formatSession(s.starts_at)}</span>
						<span class="font-display text-lg text-forest">{s.title}</span>
						<span class="block text-[0.78rem] opacity-60">with {s.host}</span>
					</span>
				</a>
			{:else}
				<p class="opacity-60">The next live sessions will be announced here.</p>
			{/each}
		</div>
		{#if live.recordings.length}
			<h3 class="h2 mt-8 mb-4 text-xl">Missed one? Watch the recording</h3>
			<div class="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-4">
				{#each live.recordings as s (s.id)}
					<a href="/live/{s.id}" class="card">
						<Thumb colors={ART.Meditation.colors} svg={ART.Meditation.svg}>
							<span class="chip on-img">Live</span><span class="play"><PlayIcon /></span>
						</Thumb>
						<p class="mt-3 font-display text-[0.62rem] font-bold tracking-[0.16em] text-moss uppercase">{date(s.starts_at)} · {s.minutes} min</p>
						<p class="font-display text-[1.05rem] leading-snug font-medium text-forest">{s.title}</p>
						<p class="text-[0.78rem] opacity-60">with {s.host}</p>
					</a>
				{/each}
			</div>
		{/if}

		<div class="mt-14"></div>

		<div class="relative overflow-hidden rounded-2xl p-8 text-stone md:p-10" style="background:linear-gradient(160deg,#1a2430,#2c4a52 60%,#3A4B39);">
			<div
				class="absolute -top-10 -right-10 h-56 w-56 rounded-full"
				style="background:radial-gradient(circle at 65% 35%,#1a2430 58%,rgba(252,250,244,.14) 59%)"
			></div>
			<div class="relative">
				<span class="chip bg-stone/15! text-stone!">New moon check-in · monthly</span>
				<p class="mt-3 font-display text-3xl font-medium md:text-4xl">{formatDay(circles.next)}</p>
				<!-- Guess: time comes from the prototype. The call link is not wired up yet. -->
				<p class="mt-1 opacity-80">19:00 Lisbon time · live on video</p>
				{#if circles.theme}
					<p class="mt-5 font-display text-xl">This month's theme: {circles.theme.theme}</p>
					<p class="mt-1 max-w-xl font-accent text-[1.15rem] italic opacity-85">{circles.theme.invitation}</p>
				{/if}
				<p class="mt-4 max-w-xl text-[0.85rem] opacity-75">
					We look back on what we experienced, share a theme and intention for the coming month, and bring practices, rituals or knowledge around it.
				</p>
				<div class="mt-5 flex flex-wrap gap-3">
					<button class="pill-btn bg-amber text-brown" disabled={setGoing.pending > 0} onclick={() => setGoing(!circles.going)}>
						{circles.going ? "✓ You're coming" : "I'll be there"}
					</button>
					<button class="pill-btn border border-stone/40 text-stone" onclick={shareReflection}>Share your reflection</button>
				</div>
				<p class="mt-5 text-[0.8rem] opacity-70">Then: {circles.later.map(formatDay).join(' and ')}</p>
			</div>
		</div>

		<h2 class="h2 mt-14 mb-5 text-2xl">ZEGG Forum recordings</h2>
		<div class="grid gap-5 md:grid-cols-3">
			{#each recordings as r (r.slug)}
				<a href="/community/recordings/{r.slug}" class="card">
					<Thumb colors={ART.Forum.colors} svg={ART.Forum.svg}>
						<span class="chip on-img">Forum</span><span class="play"><PlayIcon /></span>
					</Thumb>
					<p class="mt-3 font-display text-[0.62rem] font-bold tracking-[0.16em] text-moss uppercase">{date(r.recorded_on)} · {r.minutes} min</p>
					<p class="font-display text-[1.05rem] leading-snug font-medium text-forest">{r.title}</p>
				</a>
			{/each}
		</div>

		<div id="exchange" class="mt-14 mb-5 flex scroll-mt-20 items-end justify-between">
			<h2 class="h2 text-2xl">The exchange</h2>
			<button class="pill-btn bg-forest py-2! text-stone" onclick={() => (writing = !writing)}>Share something</button>
		</div>
		<p class="-mt-2 mb-5 text-[0.88rem] opacity-70">What did you notice in practice? What are you learning? Ask, answer and encourage each other.</p>

		{#if writing}
			<form
				class="price mb-5 flex flex-col gap-3 text-[0.85rem]"
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
				<button class="pill-btn self-start bg-forest text-stone" disabled={createThread.pending > 0}>Post</button>
			</form>
		{/if}

		{#each threads as t (t.id)}
			{@const reply = replyToThread.for(t.id)}
			<details class="border-b border-moss/20 py-4">
				<summary class="flex flex-wrap items-center gap-3">
					<span class="chip">{t.category}</span>
					<span class="font-display text-[1.02rem] font-bold text-forest">{t.title}</span>
					<span class="ml-auto text-[0.75rem] opacity-55">{t.author_name} · {t.replies.length} {t.replies.length === 1 ? 'reply' : 'replies'}</span>
				</summary>
				<p class="mt-3 text-[0.9rem] leading-[1.75] whitespace-pre-line opacity-80">{t.body}</p>
				{#each t.replies as r (r.id)}
					<p class="mt-3 border-l-2 border-amber/60 pl-4 text-[0.85rem] leading-[1.7] whitespace-pre-line">
						<b class="font-display">{r.author_name}</b>
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
					<input class="field flex-1 text-[0.85rem]" placeholder="Write a reply" aria-label="Reply" {...reply.fields.body.as('text')} />
					<button class="pill-btn bg-forest py-2! text-stone" disabled={reply.pending > 0}>Reply</button>
				</form>
			</details>
		{/each}
	</div>
</div>
