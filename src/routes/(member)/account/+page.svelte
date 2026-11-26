<script lang="ts">
	import { PRICES } from '#lib/pricing.ts';
	import { getAccount, updateName } from '#lib/remote/account.remote.ts';

	const account = $derived(await getAccount());
	const m = $derived(account.membership);
	const renews = $derived(m?.renews_on && new Date(m.renews_on).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }));
</script>

<div class="py-10">
	<div class="wrap max-w-2xl!">
		<p class="eyebrow mb-2">Account</p>
		<h1 class="display mb-8 text-4xl">Your <span class="accent">membership.</span></h1>

		<div class="glass glow mb-5">
			{#if m}
				<div class="flex flex-wrap items-center justify-between gap-3">
					<div>
						<p class="display text-xl">Essência Family, {m.plan}</p>
						{#if renews}<p class="muted text-[0.85rem]">Renews on {renews} · €{m.plan === 'yearly' ? PRICES.yearly : PRICES.monthly}</p>{/if}
					</div>
					<span class="chip">{m.status.replace('_', ' ')}</span>
				</div>
			{:else}
				<!-- shortcut: billing buttons appear once payments are connected. -->
				<p class="display text-xl">Remember member</p>
				<p class="muted text-[0.85rem]">Payments are not set up yet, so your access is free for now.</p>
			{/if}
		</div>

		<form class="glass mb-5" {...updateName}>
			<p class="display mb-3 text-xl">Your details</p>
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
				<button class="btn btn-amber btn-sm" disabled={updateName.pending > 0}>Save</button>
				{#if updateName.result?.saved}<span class="muted text-[0.8rem]">Saved</span>{/if}
			</div>
		</form>

		<a href="/auth/signout" class="link">Log out</a>
	</div>
</div>
