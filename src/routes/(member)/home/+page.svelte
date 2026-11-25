<script lang="ts">
	import { ART, formatSession, gradient } from '#lib/content.ts';
	import { formatDay } from '#lib/moon.ts';
	import CourseCard from '#lib/components/CourseCard.svelte';
	import PlayIcon from '#lib/components/PlayIcon.svelte';
	import PracticeCard from '#lib/components/PracticeCard.svelte';
	import { getCircles, getLiveSessions } from '#lib/remote/community.remote.ts';
	import { getCourses, getPractices } from '#lib/remote/content.remote.ts';

	const [practices, courses, circles, live] = $derived(
		await Promise.all([getPractices(), getCourses(), getCircles(), getLiveSessions()])
	);
	const nextLive = $derived(live.upcoming[0]);
	const latest = $derived(practices[0]);
	const art = $derived(ART[latest?.type] ?? ART.Yoga);
	// Courses already started come first.
	const continuing = $derived([...courses].sort((a, b) => b.doneCount - a.doneCount).slice(0, 2));
</script>

<div class="px-6 py-10">
	<div class="container">
		<p class="eyebrow mb-1">Good morning</p>
		<h1 class="h2 mb-8 text-3xl">This week's practice.</h1>
		{#if latest}
			<a
				href="/practice/{latest.week}"
				class="card relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl p-8 text-stone md:p-12"
				style={gradient(art.colors)}
			>
				<svg class="absolute inset-0 h-full w-full" viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true">{@html art.svg}</svg>
				<div class="relative">
					<span class="chip bg-stone/20! text-stone!">New · Week {latest.week} · {latest.type}</span>
					<p class="mt-3 mb-1 font-display text-3xl font-medium md:text-4xl">{latest.title}</p>
					<p class="mb-5 opacity-85">with {latest.teacher} · {latest.minutes} min</p>
					<span class="pill-btn bg-stone text-forest"><PlayIcon /> Begin practice</span>
				</div>
			</a>
		{/if}

		<div class="mt-6 grid gap-4 md:grid-cols-2">
		{#if nextLive}
			<a href="/live/{nextLive.id}" class="card flex items-center gap-4 rounded-2xl border border-moss/20 bg-white/50 p-4">
				<span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest text-stone"><PlayIcon /></span>
				<span>
					<span class="block font-display text-[0.62rem] font-bold tracking-[0.16em] text-moss uppercase">Next live session</span>
					<span class="font-display text-lg text-forest">{formatSession(nextLive.starts_at)}</span>
				</span>
			</a>
		{/if}
		<a href="/community" class="card flex items-center gap-4 rounded-2xl border border-moss/20 bg-white/50 p-4">
			<span
				class="h-11 w-11 shrink-0 rounded-full border border-moss/30"
				style="background:radial-gradient(circle at 65% 35%,#3A4B39 55%,#E9E4D3 56%)"
			></span>
			<span>
				<span class="block font-display text-[0.62rem] font-bold tracking-[0.16em] text-moss uppercase">New moon check-in</span>
				<span class="font-display text-lg text-forest">{formatDay(circles.next)}{circles.theme ? ` · ${circles.theme.theme}` : ''}</span>
			</span>
		</a>
		</div>

		<div class="mt-14 mb-5 flex items-end justify-between">
			<h2 class="h2 text-2xl">Continue learning</h2>
			<a href="/courses" class="text-[0.85rem] text-terra underline">All intro classes</a>
		</div>
		<div class="grid gap-4 md:grid-cols-2">
			{#each continuing as course (course.slug)}<CourseCard {course} />{/each}
		</div>

		<div class="mt-14 mb-5 flex items-end justify-between">
			<h2 class="h2 text-2xl">Earlier mornings</h2>
			<a href="/practice" class="text-[0.85rem] text-terra underline">Whole archive</a>
		</div>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each practices.slice(1, 5) as practice (practice.week)}<PracticeCard {practice} />{/each}
		</div>
	</div>
</div>
