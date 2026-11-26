<script lang="ts">
	import { COURSE_SVG, percent } from '#lib/content.ts';
	import Ring from './Ring.svelte';
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
</script>

<a href="/courses/{c.slug}" class="card">
	<Thumb colors={c.colors} svg={COURSE_SVG}><Ring pct={percent(c.doneCount, c.lessonCount)} /></Thumb>
	<p class="ttl mt-3 text-[1.3rem]!">{c.title}</p>
	<p class="muted my-1 text-[0.86rem] leading-snug">{c.blurb}</p>
	<p class="meta mt-2!">Intro class · {c.lessonCount} lessons · {c.duration}{c.creator ? ` · by ${c.creator}` : ''}</p>
</a>
