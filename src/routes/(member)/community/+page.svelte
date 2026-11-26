<script lang="ts">
	import { ART, THREAD_CATEGORIES, formatSession } from '#lib/content.ts';
	import { formatDay } from '#lib/moon.ts';
	import Moon from '#lib/components/Moon.svelte';
	import PlayIcon from '#lib/components/PlayIcon.svelte';
	import Thumb from '#lib/components/Thumb.svelte';
	import {
		createThread,
		getCircles,
		getThreads,
		replyToThread,
		setGoing
	} from '#lib/remote/community.remote.ts';
	import { getLiveSessions, getRecordings } from '#lib/remote/content.remote.ts';

	const [circles, live, recordings, threads] = $derived(
		await Promise.all([getCircles(), getLiveSessions(), getRecordings(), getThreads()])
	);
	let writing = $state(false);

	function shareReflection() {
		writing = true;
		createThread.fields.category.set('New moon reflections');
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

		<h2 class="display mt-14 mb-4 text-2xl md:text-3xl">Live practice</h2>
		<!-- Planned in the back-office as practices with a "Live at" time; afterwards they are recordings in the practice library. -->
		<div class="grid gap-4 md:grid-cols-2">
			{#each live.slice(0, 4) as s (s.id)}
				<a href="/practice/{s.id}" class="glass card flex items-center gap-5">
					<span class="flex h-[56px] w-[56px] shrink-0 items-center justify-center rounded-full bg-stone text-forest"><PlayIcon size={18} /></span>
					<span>
						<span class="meta mt-0! block">{s.type} · {formatSession(s.starts_at!)}</span>
						<span class="display block text-xl">{s.title}</span>
						<span class="muted text-[0.84rem]">with {s.teacher}</span>
					</span>
				</a>
			{:else}
				<p class="muted">The next live practices will be announced here.</p>
			{/each}
		</div>
		<p class="muted mt-4 text-[0.85rem]">Missed one? Every live practice stays in the <a href="/practice" class="link">practice library</a>.</p>

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

		<div id="exchange" class="mt-14 mb-3 flex scroll-mt-20 flex-wrap items-end justify-between gap-3">
			<h2 class="display text-2xl md:text-3xl">The exchange</h2>
			<button class="btn btn-light btn-sm" onclick={() => (writing = !writing)}>Start a conversation</button>
		</div>
		<p class="muted mb-5 text-[0.88rem]">What did you notice in practice? What are you learning? Ask, answer and encourage each other.</p>

		{#if writing}
			<form
				class="glass mb-5 flex flex-col gap-3"
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
				<button class="btn btn-amber btn-sm self-start" disabled={createThread.pending > 0}>Post</button>
			</form>
		{/if}

		<div class="flex flex-col gap-3">
			{#each threads as t (t.id)}
				{@const reply = replyToThread.for(t.id)}
				<details class="glass py-4!">
					<summary class="flex flex-wrap items-center gap-3">
						<span class="chip">{t.category}</span>
						<span class="display text-[1.15rem] text-stone">{t.title}</span>
						<span class="muted ml-auto text-[0.75rem]">{t.author_name} · {t.replies.length} {t.replies.length === 1 ? 'reply' : 'replies'}</span>
					</summary>
					<p class="muted mt-3 text-[0.92rem] leading-[1.75] whitespace-pre-line">{t.body}</p>
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
			{/each}
		</div>
	</div>
</div>
