<script lang="ts">
	import { getNotifications, markNotificationsSeen } from '#lib/remote/notifications.remote.ts';

	// Not awaited, so the header never waits for it.
	const news = getNotifications();
	let opened = $state(false);
	const count = $derived(opened ? 0 : (news.current?.total ?? 0));

	// The list stays as it was while open; it is refreshed (and so emptied) once the member closes it.
	async function toggle(e: ToggleEvent) {
		if (e.newState === 'open') {
			if (!news.current?.total) return;
			opened = true;
			await markNotificationsSeen();
		} else if (opened) {
			await news.refresh();
			opened = false;
		}
	}
</script>

<button
	popovertarget="news"
	class="bell relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-ink/70 hover:text-stone"
	aria-label={count ? `${count} new` : 'Nothing new'}
>
	<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
		<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
	</svg>
	{#if count}<span class="badge">{count > 9 ? '9+' : count}</span>{/if}
</button>

<div id="news" popover class="news glass" ontoggle={toggle}>
	<p class="eyebrow mb-3">New for you</p>
	{#if news.current?.items.length}
		<ul class="flex flex-col gap-1">
			{#each news.current.items as item (item.key)}
				<li>
					<a href={item.href} class="item" onclick={() => document.getElementById('news')?.hidePopover()}>
						<span class="dot"></span>{item.text}
					</a>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="muted text-[0.88rem] italic">You are all caught up. Enjoy the quiet.</p>
	{/if}
</div>

<style>
	.badge {
		position: absolute; top: 0; right: 0; min-width: 15px; height: 15px; padding: 0 3px; border-radius: 8px;
		font: 700 0.58rem/15px var(--font-display); text-align: center; color: #241a08;
		background: radial-gradient(circle at 40% 35%, #fff0c4, #e8b455 60%, #c4922a); box-shadow: 0 0 10px 1px rgba(232, 180, 85, 0.6);
	}
	.news {
		position: fixed; inset: 4.5rem 1rem auto auto; margin: 0; width: min(22rem, calc(100vw - 2rem)); padding: 1.2rem 1.3rem;
		color: var(--color-ink); background: rgba(15, 22, 15, 0.86); backdrop-filter: blur(16px); box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5);
	}
	.item { display: flex; align-items: baseline; gap: 0.65rem; padding: 0.5rem 0.4rem; border-radius: 10px; font-size: 0.9rem; line-height: 1.4; transition: background 0.2s; }
	.item:hover { background: rgba(252, 250, 244, 0.07); color: var(--color-stone); }
	.dot { flex-shrink: 0; width: 7px; height: 7px; border-radius: 50%; background: var(--color-glow); box-shadow: 0 0 8px 1px rgba(232, 180, 85, 0.55); transform: translateY(-1px); }
</style>
