<script lang="ts">
	import { COURSE_SVG } from '#lib/content.ts';
	import { EARLY_BIRD, PRICES } from '#lib/pricing.ts';
	import PracticeCard from '#lib/components/PracticeCard.svelte';
	import Thumb from '#lib/components/Thumb.svelte';
	import { getPreview } from '#lib/remote/content.remote.ts';

	const preview = $derived(await getPreview());
	// shortcut: join buttons go to sign-in until payments are decided; then they start checkout.
	const join = '/auth/signin?callbackUrl=/home';
	const faq = [
		['What does "remember member" mean?', 'We see healing as remembering, revealing and blossoming, not as fixing something that is wrong. As a member you remember who you already are, together with others.'],
		['Do I need experience?', 'No. Every practice is made for mixed levels, and the intro classes start from the beginning.'],
		['What if I can\'t join live?', 'Every live session is recorded, so you can practise when it suits you.'],
		['Can I cancel?', 'Yes, any time from your account page.'],
		['Where does my money go?', 'Into making the practices and courses, and into the life of the community on the land.']
	];
</script>

<section
	class="relative overflow-hidden text-stone"
	style="background:linear-gradient(180deg,#1f2a1f 0%,#3A4B39 45%,#8a6b45 85%,#C4922A 100%);"
>
	<svg class="absolute inset-0 h-full w-full" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
		<circle cx="500" cy="470" r="120" fill="rgba(255,225,160,0.35)" /><circle cx="500" cy="470" r="70" fill="rgba(255,230,180,0.6)" />
		<path d="M0,520 Q250,440 500,500 T1000,480 L1000,600 L0,600Z" fill="rgba(20,30,18,0.55)" />
		<path d="M0,560 Q300,500 560,550 T1000,540 L1000,600 L0,600Z" fill="rgba(15,22,14,0.7)" />
	</svg>
	<div class="relative container py-24 text-center md:py-32">
		<p class="eyebrow mb-4 text-amber!">Essência Family</p>
		<h1 class="mb-5 font-display text-4xl leading-tight font-medium md:text-5xl">Healing as<br />remembering.</h1>
		<p class="mx-auto mb-8 max-w-lg font-accent text-[1.25rem] leading-relaxed text-stone/85 italic">
			Not fixing what is wrong, but remembering, revealing and blossoming. Practise, share and grow together, as a remember member.
		</p>
		<a href="#pricing" class="pill-btn bg-amber text-brown">Join the Family</a>
		<a href="/home" class="pill-btn ml-2 border border-stone/50 text-stone">See inside</a>
	</div>
</section>

<section class="px-6 py-16">
	<div class="container grid gap-6 text-center md:grid-cols-3">
		<div>
			<p class="mb-2 font-display text-3xl text-amber">2 / week</p>
			<p class="h2 mb-2 text-xl">Live sessions</p>
			<p class="text-[0.88rem] leading-relaxed opacity-75">Join the morning practice live from the land, or watch the recording later. A growing library of meditation, breathwork and more.</p>
		</div>
		<div>
			<p class="mb-2 font-display text-3xl text-amber">Monthly</p>
			<p class="h2 mb-2 text-xl">New moon check-in</p>
			<p class="text-[0.88rem] leading-relaxed opacity-75">Reflect on the month that passed, share what you experienced, and set a theme and intention for the next.</p>
		</div>
		<div>
			<p class="mb-2 font-display text-3xl text-amber">Together</p>
			<p class="h2 mb-2 text-xl">A circle to support each other</p>
			<p class="text-[0.88rem] leading-relaxed opacity-75">A place to share your experience, ask, answer and encourage each other between sessions.</p>
		</div>
	</div>
</section>

<section class="bg-parch/45 px-6 py-14">
	<div class="container">
		<p class="eyebrow mb-2">A taste of the archive</p>
		<h2 class="h2 mb-8 text-2xl md:text-3xl">Mornings you can look forward to.</h2>
		<div class="grid grid-cols-2 gap-4 md:grid-cols-4">
			{#each preview.practices as practice, i (practice.week)}
				<PracticeCard {practice} locked={i > 0} />
			{/each}
		</div>
	</div>
</section>

<section class="px-6 py-16">
	<div class="container">
		<p class="eyebrow mb-2">Intro classes</p>
		<h2 class="h2 mb-2 text-2xl md:text-3xl">Knowledge from a living community.</h2>
		<p class="mb-8 text-[0.92rem] opacity-70">Short intro classes are part of the membership. Each creator offers the full course on their own website.</p>
		<div class="grid gap-4 md:grid-cols-2">
			{#each preview.courses as c (c.slug)}
				<div class="flex items-center gap-4">
					<div class="w-28 shrink-0"><Thumb colors={c.colors} svg={COURSE_SVG} /></div>
					<div>
						<p class="font-display text-[1.05rem] leading-snug font-medium text-forest">{c.title}</p>
						<p class="text-[0.78rem] opacity-65">{c.lessonCount} lessons · {c.duration}{c.creator ? ` · by ${c.creator}` : ''}</p>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<section id="pricing" class="scroll-mt-20 bg-parch/45 px-6 py-16">
	<div class="container text-center">
		<p class="eyebrow mb-2">Membership</p>
		<h2 class="h2 mb-10 text-2xl md:text-3xl">Become a remember member.</h2>
		<div class="mx-auto grid max-w-2xl gap-5 text-left md:grid-cols-2">
			<div class="price">
				<p class="font-display font-bold text-forest">Monthly</p>
				<p class="my-2 font-display text-3xl text-terra">€{PRICES.monthly}<span class="text-sm opacity-60"> / month</span></p>
				<ul class="ticks mb-6 flex flex-col gap-1.5">
					<li>Two live sessions a week, all recorded</li>
					<li>The whole practice library &amp; intro classes</li>
					<li>New moon check-ins &amp; the exchange</li>
					<li>Cancel any time</li>
				</ul>
				<a href={join} class="pill-btn bg-forest text-stone">Start monthly</a>
			</div>
			<div class="price best">
				<p class="font-display font-bold text-forest">
					Yearly <span class="chip ml-1">{EARLY_BIRD ? 'Early bird' : 'Best value'}</span>
				</p>
				{#if EARLY_BIRD}
					<p class="my-2 font-display text-3xl text-terra">
						€{PRICES.earlyBird}<span class="text-sm opacity-60"> / year</span>
						<s class="ml-1 text-base opacity-50">€{PRICES.yearly}</s>
					</p>
				{:else}
					<p class="my-2 font-display text-3xl text-terra">€{PRICES.yearly}<span class="text-sm opacity-60"> / year</span></p>
				{/if}
				<ul class="ticks mb-6 flex flex-col gap-1.5">
					<li>Everything in monthly</li>
					<li>{EARLY_BIRD ? 'Launch price, only for the first members' : 'Save on twelve months'}</li>
					<li>Cancel any time</li>
				</ul>
				<a href={join} class="pill-btn bg-amber text-brown">Start yearly</a>
			</div>
		</div>
	</div>
</section>

<section class="px-6 py-16">
	<div class="container max-w-2xl">
		<h2 class="h2 mb-6 text-center text-2xl">Questions</h2>
		{#each faq as [q, a] (q)}
			<details class="border-b border-moss/20 py-4">
				<summary class="font-display font-bold text-forest">{q}</summary>
				<p class="mt-2 text-[0.88rem] leading-relaxed opacity-75">{a}</p>
			</details>
		{/each}
	</div>
</section>
