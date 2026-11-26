<script lang="ts">
	import { ART, COURSE_SVG, PRACTICE_TYPES, gradient } from '#lib/content.ts';
	import { EARLY_BIRD, PRICES } from '#lib/pricing.ts';
	import Moon from '#lib/components/Moon.svelte';
	import PlayIcon from '#lib/components/PlayIcon.svelte';
	import PracticeCard from '#lib/components/PracticeCard.svelte';
	import { getPreview } from '#lib/remote/content.remote.ts';

	const preview = $derived(await getPreview());
	const latest = $derived(preview.practices[0]);
	// shortcut: join buttons go to sign-in until payments are decided; then they start checkout.
	const join = '/auth/signin?callbackUrl=/home';
	const faq = [
		['What does "remember member" mean?', 'We see healing as remembering, revealing and blossoming, not as fixing something that is wrong. As a member you remember who you already are, together with others.'],
		['Do I need experience?', 'No. Every practice is made for mixed levels, and the intro classes start from the beginning.'],
		["What if I can't join live?", 'Every live session is recorded, so you can practise when it suits you.'],
		['Can I cancel?', 'Yes, any time from your account page.'],
		['Where does my money go?', 'Into making the practices and courses, and into the life of the community on the land.']
	];
	const marquee = [...PRACTICE_TYPES, 'Live sessions', 'New moon check-ins', 'Intro classes'];
	// Fixed pseudo-random positions so server and browser render the same stars.
	const stars = Array.from({ length: 46 }, (_, i) => ({ x: (i * 61.8) % 100, y: (i * 37.3) % 100, d: ((i * 0.7) % 3).toFixed(1) }));
	const forumDots = [0, 1, 2, 3, 4, 5, 6, 7].map((i) => ({ x: 100 + 50 * Math.cos((i * Math.PI) / 4), y: 70 + 50 * Math.sin((i * Math.PI) / 4), glow: i % 3 === 0 }));
	const hills = [
		{ s: 0.1, h: '52%', d: 'M0,190 C240,110 430,70 700,130 S1180,190 1440,100 L1440,400 L0,400Z', fill: '#26392a' },
		{ s: 0.05, h: '38%', d: 'M0,250 C260,180 520,235 760,190 S1220,140 1440,220 L1440,400 L0,400Z', fill: '#17261b' },
		{ s: 0, h: '24%', d: 'M0,300 C300,240 520,320 820,270 S1250,260 1440,310 L1440,400 L0,400Z', fill: '#0f160f' }
	];

	let scrollY = $state(0);
	let root: HTMLElement;
	// Scroll reveal: only hide content once JavaScript is there to show it again.
	$effect(() => {
		root.classList.add('reveal');
		const io = new IntersectionObserver(
			(es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
			{ threshold: 0.12 }
		);
		root.querySelectorAll('.rv').forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
</script>

<svelte:window bind:scrollY />

<div bind:this={root}>
	<section class="hero">
		<div class="stars" aria-hidden="true">
			{#each stars as s, i (i)}<span style="left:{s.x}%;top:{s.y}%;animation-delay:{s.d}s"></span>{/each}
		</div>
		<div class="sky-glow"></div>
		<div class="sun" aria-hidden="true"></div>
		{#each hills as hill (hill.fill)}
			<svg class="hill" style="height:{hill.h};transform:translateY({Math.min(scrollY, 900) * hill.s}px)" viewBox="0 0 1440 400" preserveAspectRatio="none" aria-hidden="true"
				><path d={hill.d} fill={hill.fill} /></svg
			>
		{/each}
		<div class="hero-in wrap">
			<p class="eyebrow mb-5">Essência Family</p>
			<h1 class="display mb-6">Healing as<br /><span class="accent" style="font-size:1.12em">remembering.</span></h1>
			<p class="mx-auto mb-8 max-w-xl font-accent text-[1.25rem] leading-relaxed text-stone/90 italic">
				Not fixing what is wrong, but remembering, revealing and blossoming. Practise, share and grow together, as a remember member.
			</p>
			<a href="#pricing" class="btn btn-amber">Join the Family</a>
			<a href="/home" class="btn btn-ghost ml-2">See inside</a>
		</div>
		{#if latest}
			<a href="#pricing" class="hero-card">
				<p class="eyebrow mb-1 text-[0.6rem]!">New this week</p>
				<p class="display text-xl text-stone">{latest.title}</p>
				<p class="mb-3 text-[0.78rem] text-stone/70">{latest.type} · {latest.minutes} min · with {latest.teacher}</p>
				<span class="btn btn-light btn-sm"><PlayIcon size={12} /> Watch</span>
			</a>
		{/if}
		<span class="scroll-hint">Scroll</span>
	</section>

	<div class="marquee" aria-hidden="true">
		<div>
			{#each [0, 1] as n (n)}{#each marquee as word (word)}<span>{word}</span><b>✦</b>{/each}{/each}
		</div>
	</div>

	<section class="py-20">
		<div class="wrap">
			<p class="eyebrow rv mb-3">What's inside</p>
			<h2 class="display rv mb-12 max-w-2xl text-3xl md:text-5xl">One community, <span class="accent">many ways</span> to be part of it.</h2>
			<div class="bento">
				<div class="tile t-a rv">
					<span class="chip">Twice a week</span>
					<h3 class="display mt-4 mb-3 max-w-sm text-3xl md:text-4xl">Live on the land, recorded for later.</h3>
					<p class="muted mb-5 max-w-xs text-[0.95rem] leading-relaxed">
						Join the morning practice live, or watch the recording when it suits you. A growing library of meditation, breathwork and more.
					</p>
					<div class="flex max-w-xs flex-wrap gap-2">
						{#each PRACTICE_TYPES as t (t)}<span class="chip">{t}</span>{/each}
					</div>
					<div aria-hidden="true">
						{#each [['f1', 'Yoga'], ['f2', 'Breathwork'], ['f3', 'Qi Gong']] as [cls, t] (cls)}
							<div class="fan {cls}" style={gradient(ART[t].colors)}>
								<svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice">{@html ART[t].svg}</svg>
							</div>
						{/each}
					</div>
				</div>
				<div class="tile t-b rv">
					<span class="chip">Every new moon</span>
					<div class="moonwrap my-4 flex justify-center"><Moon size={120} /></div>
					<p class="display text-center text-xl">New moon check-in</p>
					<p class="muted text-center text-[0.82rem]">Reflect, share and set an intention</p>
				</div>
				<div class="tile t-c rv">
					<span class="chip">ZEGG Forum</span>
					<svg viewBox="0 0 200 140" class="my-3 w-full" aria-hidden="true">
						<circle cx="100" cy="70" r="50" fill="none" stroke="rgba(252,250,244,.2)" stroke-width="2" />
						{#each forumDots as d, i (i)}<circle cx={d.x} cy={d.y} r="7" fill={d.glow ? '#e8b455' : 'rgba(252,250,244,.6)'} />{/each}
					</svg>
					<p class="display text-center text-xl">Recorded rounds</p>
					<p class="muted text-center text-[0.82rem]">See how the Forum works</p>
				</div>
				<div class="tile t-d rv">
					<span class="chip">Intro classes</span>
					<div class="mt-5 flex flex-col gap-2.5">
						{#each preview.courses as c (c.slug)}
							<div class="flex items-center gap-3">
								<span class="h-9 w-9 shrink-0 rounded-[10px_4px_10px_4px]" style={gradient(c.colors)}></span>
								<span>
									<span class="display block text-[1.02rem] leading-tight">{c.title}</span>
									<span class="muted text-[0.74rem]">{c.lessonCount} lessons · {c.duration}{c.creator ? ` · by ${c.creator}` : ''}</span>
								</span>
							</div>
						{/each}
					</div>
					<p class="muted mt-4 text-[0.78rem]">Each creator offers the full course on their own website.</p>
				</div>
				<div class="tile t-e rv">
					<span class="chip">The exchange</span>
					<div class="mt-5 flex flex-col gap-2.5">
						<p class="bub">This morning's breathwork stayed with me all day.</p>
						<p class="bub me">Same here. The long exhale is my new favourite.</p>
						<p class="bub">Sharing it at the new moon check-in.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="pb-20">
		<div class="wrap">
			<div class="rv mb-6 flex flex-wrap items-end justify-between gap-3">
				<div>
					<p class="eyebrow mb-2">A taste of the archive</p>
					<h2 class="display text-3xl md:text-4xl">Mornings to look forward to.</h2>
				</div>
				<a href="#pricing" class="link">Unlock them all</a>
			</div>
			<div class="rail">
				{#each preview.practices as practice, i (practice.week)}<PracticeCard {practice} locked={i > 0} />{/each}
			</div>
		</div>
	</section>

	<section class="relative overflow-hidden py-24 text-center" style="background:radial-gradient(ellipse 60% 80% at 50% 0%,rgba(232,180,85,.14),transparent 70%),#0b110c;">
		<div class="wrap max-w-3xl!">
			<p class="eyebrow rv mb-5">Why a Family</p>
			<p class="display rv text-3xl md:text-5xl">We learned it by living it. <span class="accent">Now we share</span> what the land has taught us.</p>
		</div>
	</section>

	<svg class="wave" viewBox="0 0 1440 70" preserveAspectRatio="none" style="background:#0b110c" aria-hidden="true"
		><path d="M0,40 C240,0 480,70 720,36 S1200,6 1440,40 L1440,70 L0,70Z" fill="#F3EEDF" /></svg
	>
	<section id="pricing" class="day scroll-mt-16 py-20">
		<div class="wrap text-center">
			<p class="eyebrow mb-3">Membership</p>
			<h2 class="display mb-12 text-3xl md:text-5xl">Become a remember member.</h2>
			<div class="mx-auto grid max-w-2xl gap-6 md:grid-cols-2">
				<div class="pc">
					<p class="font-display text-lg font-bold text-forest">Monthly</p>
					<p class="my-2 font-display text-4xl text-terra">€{PRICES.monthly}<span class="text-sm opacity-60"> / month</span></p>
					<ul class="ticks mb-7 flex flex-col gap-1.5">
						<li>Two live sessions a week, all recorded</li>
						<li>The whole practice library &amp; intro classes</li>
						<li>New moon check-ins &amp; the exchange</li>
						<li>Cancel any time</li>
					</ul>
					<a href={join} class="btn btn-forest">Start monthly</a>
				</div>
				<div class="pc best">
					<p class="font-display text-lg font-bold text-forest">
						Yearly <span class="chip ml-1">{EARLY_BIRD ? 'Early bird' : 'Best value'}</span>
					</p>
					{#if EARLY_BIRD}
						<p class="my-2 font-display text-4xl text-terra">
							€{PRICES.earlyBird}<span class="text-sm opacity-60"> / year</span>
							<s class="ml-1 text-lg opacity-50">€{PRICES.yearly}</s>
						</p>
					{:else}
						<p class="my-2 font-display text-4xl text-terra">€{PRICES.yearly}<span class="text-sm opacity-60"> / year</span></p>
					{/if}
					<ul class="ticks mb-7 flex flex-col gap-1.5">
						<li>Everything in monthly</li>
						<li>{EARLY_BIRD ? 'Launch price, only for the first members' : 'Save on twelve months'}</li>
						<li>Cancel any time</li>
					</ul>
					<a href={join} class="btn btn-amber">Start yearly</a>
				</div>
			</div>
		</div>
	</section>
	<section class="day pb-20">
		<div class="wrap max-w-2xl!">
			<h2 class="display mb-6 text-center text-3xl">Questions</h2>
			{#each faq as [q, a] (q)}
				<details>
					<summary>{q}</summary>
					<p class="mt-2 text-[0.9rem] leading-relaxed opacity-75">{a}</p>
				</details>
			{/each}
		</div>
	</section>
</div>
