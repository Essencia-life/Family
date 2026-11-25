<script lang="ts">
	import { PRICES } from '#lib/pricing.ts';
	import { getAccount, updateName } from '#lib/remote/account.remote.ts';

	const account = $derived(await getAccount());
	const m = $derived(account.membership);
	const renews = $derived(m?.renews_on && new Date(m.renews_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
</script>

<div class="px-6 py-10">
	<div class="container max-w-2xl">
		<p class="eyebrow mb-1">Account</p>
		<h1 class="h2 mb-8 text-3xl">Your membership.</h1>

		<div class="price best mb-5">
			{#if m}
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p class="font-display text-lg font-bold text-forest">Essência Family, {m.plan}</p>
						{#if renews}<p class="text-[0.85rem] opacity-70">Renews on {renews} · €{m.plan === 'yearly' ? PRICES.yearly : PRICES.monthly}</p>{/if}
					</div>
					<span class="chip">{m.status.replace('_', ' ')}</span>
				</div>
			{:else}
				<!-- shortcut: billing buttons appear once payments are connected. -->
				<p class="font-display text-lg font-bold text-forest">Remember member</p>
				<p class="text-[0.85rem] opacity-70">Payments are not set up yet, so your access is free for now.</p>
			{/if}
		</div>

		<form class="price mb-5" {...updateName}>
			<p class="mb-3 font-display font-bold text-forest">Your details</p>
			<div class="grid gap-3 text-[0.85rem] md:grid-cols-2">
				<label class="flex flex-col gap-1">
					Name
					<input class="field" {...updateName.fields.name.as('text', account.name)} />
					{#each updateName.fields.name.issues() ?? [] as issue (issue.message)}<span class="issue">{issue.message}</span>{/each}
				</label>
				<label class="flex flex-col gap-1">
					Email
					<input class="field opacity-70" value={account.email} readonly title="Your email is how you log in" />
				</label>
			</div>
			<div class="mt-4 flex items-center gap-3">
				<button class="pill-btn bg-forest text-stone" disabled={updateName.pending > 0}>Save</button>
				{#if updateName.result?.saved}<span class="text-[0.8rem] opacity-70">Saved</span>{/if}
			</div>
		</form>

		<a href="/auth/signout" class="text-[0.85rem] text-terra underline">Log out</a>
	</div>
</div>
