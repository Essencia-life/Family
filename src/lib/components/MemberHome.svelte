<script lang="ts">
	import { ART, formatSession, gradient } from '#lib/content.ts';
	import { formatDay } from '#lib/moon.ts';
	import CourseCard from '#lib/components/CourseCard.svelte';
	import Moon from '#lib/components/Moon.svelte';
	import PlayIcon from '#lib/components/PlayIcon.svelte';
	import PracticeCard from '#lib/components/PracticeCard.svelte';
	import Ring from '#lib/components/Ring.svelte';
	import { getCircles, getLiveSessions } from '#lib/remote/community.remote.ts';
	import { getCourses, getPractices } from '#lib/remote/content.remote.ts';
	import { getRhythm } from '#lib/remote/progress.remote.ts';
	import { thumbnails } from '#lib/video.ts';
	import Cover from '#lib/components/Cover.svelte';

	const [practices, courses, circles, live, rhythm] = $derived(
		await Promise.all([getPractices(), getCourses(), getCircles(), getLiveSessions(), getRhythm()])
	);
	const nextLive = $derived(live.upcoming[0]);
	const latest = $derived(practices[0]);
	const art = $derived(ART[latest?.type] ?? ART.Yoga);
	// Courses already started come first.
	const continuing = $derived([...courses].sort((a, b) => b.doneCount - a.doneCount).slice(0, 3));
	const started = $derived(courses.filter((c) => c.doneCount).length);
	const practisedPct = $derived(practices.length ? Math.round((practices.filter((p) => p.practised).length / practices.length) * 100) : 0);
	const daysTo = (day: string) => Math.max(0, Math.round((Date.parse(day + 'T19:00:00Z') - Date.now()) / 864e5));
	const inDays = (n: number) => (n ? `in ${n} day${n > 1 ? 's' : ''}` : 'tonight');
</script>

<div class="py-10">
	<div class="wrap">
		<div class="mb-8 flex flex-wrap items-end justify-between gap-6">
			<div>
				<p class="eyebrow mb-2">Good morning</p>
				<h1 class="display text-4xl md:text-5xl">This week's <span class="accent">practice.</span></h1>
			</div>
			<div>
				<p class="meta mt-0! mb-2">Your mornings · last 7 days</p>
				<div class="days" title="A glowing circle means you marked a practice as done that day.">
					{#each rhythm.week as d, i (i)}<div class="dd" class:on={d.on} class:today={d.today}><i></i>{d.label}</div>{/each}
				</div>
			</div>
		</div>

		{#if latest}
			<a href="/practice/{latest.id}" class="feature card" style={gradient(art.colors)}>
				<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{@html art.svg}</svg>
				<Cover thumbs={thumbnails(latest)} />
				<span class="chip mb-3 self-start bg-stone/20! text-stone!">New · Week {latest.week} · {latest.type}</span>
				<p class="display mb-2 text-4xl md:text-6xl">{latest.title}</p>
				<p class="mb-6 text-stone/85">with {latest.teacher} · {latest.minutes} min</p>
				<span class="flex items-center gap-4"><span class="bigplay"><PlayIcon size={26} /></span><span class="font-accent text-[1.3rem] italic">Begin practice</span></span>
			</a>
		{/if}

		<div class="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#if nextLive}
				<a href="/live/{nextLive.id}" class="glass card flex! items-center gap-5">
					<span class="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-full bg-stone text-forest"><PlayIcon size={22} /></span>
					<span>
						<span class="meta mt-0! block">Next live session</span>
						<span class="display block text-xl">{formatSession(nextLive.starts_at)}</span>
						<span class="muted text-[0.84rem]">{nextLive.title} · with {nextLive.host}</span>
					</span>
				</a>
			{/if}
			<a href="/community" class="glass card flex! items-center gap-5">
				<Moon size={68} />
				<span>
					<span class="meta mt-0! block">New moon check-in</span>
					<span class="display block text-xl">{formatDay(circles.next)}</span>
					<span class="font-accent text-[1.1rem] text-glow italic">{inDays(daysTo(circles.next))}{circles.theme ? ` · ${circles.theme.theme}` : ''}</span>
				</span>
			</a>
			<div class="glass flex items-center gap-5">
				<Ring pct={practisedPct} class="h-[68px] w-[68px] shrink-0" />
				<span>
					<span class="meta mt-0! block">Your journey</span>
					<span class="display block text-xl">{rhythm.thisMonth} {rhythm.thisMonth === 1 ? 'morning' : 'mornings'} this month</span>
					<span class="muted text-[0.84rem]">{started} {started === 1 ? 'intro class' : 'intro classes'} in progress</span>
				</span>
			</div>
		</div>

		<div class="mt-14 mb-4 flex items-end justify-between">
			<h2 class="display text-2xl md:text-3xl">Continue learning</h2>
			<a href="/courses" class="link">All intro classes</a>
		</div>
		<div class="rail wide">
			{#each continuing as course (course.slug)}<CourseCard {course} />{/each}
		</div>

		<div class="mt-10 mb-4 flex items-end justify-between">
			<h2 class="display text-2xl md:text-3xl">Earlier mornings</h2>
			<a href="/practice" class="link">Whole archive</a>
		</div>
		<div class="rail">
			{#each practices.slice(1, 7) as practice (practice.id)}<PracticeCard {practice} />{/each}
		</div>
	</div>
</div>
