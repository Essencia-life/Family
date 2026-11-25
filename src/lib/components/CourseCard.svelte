<script lang="ts">
	import { COURSE_SVG, percent } from '#lib/content.ts';
	import Thumb from './Thumb.svelte';

	type Course = {
		slug: string;
		title: string;
		blurb: string;
		level: string;
		duration: string;
		colors: string[];
		creator: string | null;
		lessonCount: number;
		doneCount: number;
	};
	let { course: c }: { course: Course } = $props();
	const pct = $derived(percent(c.doneCount, c.lessonCount));
</script>

<a href="/courses/{c.slug}" class="card">
	<Thumb colors={c.colors} svg={COURSE_SVG} />
	<p class="mt-3 font-display text-[1.15rem] leading-snug font-medium text-forest">{c.title}</p>
	<p class="my-1 text-[0.82rem] leading-snug opacity-70">{c.blurb}</p>
	<p class="mb-2 text-[0.74rem] opacity-55">Intro class · {c.lessonCount} lessons · {c.duration}{c.creator ? ` · by ${c.creator}` : ''}</p>
	<div class="track"><div class="fill" style="width:{pct}%"></div></div>
	<p class="mt-1 text-[0.72rem] opacity-60">{pct}% complete</p>
</a>
