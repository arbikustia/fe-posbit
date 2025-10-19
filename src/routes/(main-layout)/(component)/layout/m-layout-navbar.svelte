<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
	import { currentPage } from '$lib/helpers/page-helper';
	import { Flight, Hotel, Train, Insurance, Home, User, Document, DashboardIcon, PurchaseIcon } from '$lib/components/icons';
	import * as m from '$lib/paraglide/messages.js';

	const navbarItems = [
		{
			icon: DashboardIcon,
			label: "Dashboard",
			href: '/dashboard'
		},
		{
			icon: PurchaseIcon,
			label: "Purchase",
			href: '/purchase'
		},
		{
			icon: User,
			label: m.my_profile(),
			href: '/profile'
		}
	];

	const current = $derived(currentPage(page.url.pathname));
</script>

<div class="fixed bottom-0 w-full max-w-lg overflow-hidden rounded-t-lg bg-white pb-1 shadow-inner">
	<ul class="flex justify-around">
		{#each navbarItems as { icon, label, href }, i}
			{@const isActive = href === '/' ? current === href || current === '' : current === href}
			{@const Icon = icon}
			<li
				class={cn('relative flex w-[20%] max-w-[20%] items-center justify-center py-2', {
					'bg-primary/5': isActive
				})}
			>
				<a
					{href}
					class={cn(
						'flex w-fit flex-col items-center justify-around gap-y-1 text-xs font-semibold text-gray-500',
						{
							'text-primary': isActive
						}
					)}
				>
					<Icon class="h-5 w-5" />
					<span>{label}</span>
				</a>
				{#if isActive}
					<div
						class="border-primary absolute bottom-[-2px] left-0 right-0 rounded-t-lg border-t-4"
					></div>
				{/if}
			</li>
		{/each}
	</ul>
</div>
