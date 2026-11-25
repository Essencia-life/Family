<script lang="ts">
	import { ART, THREAD_CATEGORIES } from '#lib/content.ts';
	import { formatDay } from '#lib/moon.ts';
	import PlayIcon from '#lib/components/PlayIcon.svelte';
	import Thumb from '#lib/components/Thumb.svelte';
	import { createThread, getCircles, getThreads, replyToThread, setGoing } from '#lib/remote/community.remote.ts';
	import { getRecordings } from '#lib/remote/content.remote.ts';

	const [circles, recordings, threads] = $derived(await Promise.all([getCircles(), getRecordings(), getThreads()]));
	let writing = $state(false);
	const date = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
</script>

<div class="px-6 py-10">
	<div class="container">
		<p class="eyebrow mb-1">Community</p>
		<h1 class="h2 mb-8 text-3xl">Come together.</h1>

		<div class="relative overflow-hidden rounded-2xl p-8 text-stone md:p-10" style="background:linear-gradient(160deg,#1a2430,#2c4a52 60%,#3A4B39);">
			<div
				class="absolute -top-10 -right-10 h-56 w-56 rounded-full"
				style="background:radial-gradient(circle at 65% 35%,#1a2430 58%,rgba(252,250,244,.14) 59%)"
			></div>
			<div class="relative">
				<span class="chip bg-stone/15! text-stone!">Every new moon</span>
				<p class="mt-3 font-display text-3xl font-medium md:text-4xl">{formatDay(circles.next)}</p>
				<!-- Guess: time and place come from the prototype. The call link is not wired up yet. -->
				<p class="mt-1 mb-5 opacity-80">Sharing circle · 19:00 Lisbon time · live on video</p>
				<button class="pill-btn bg-amber text-brown" disabled={setGoing.pending > 0} onclick={() => setGoing(!circles.going)}>
					{circles.going ? "✓ You're coming" : "I'll be there"}
				</button>
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

		<div class="mt-14 mb-5 flex items-end justify-between">
			<h2 class="h2 text-2xl">The exchange</h2>
			<button class="pill-btn bg-forest py-2! text-stone" onclick={() => (writing = !writing)}>Start a conversation</button>
		</div>

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
