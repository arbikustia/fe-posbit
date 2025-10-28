<script lang="ts">
	import { page } from '$app/state';
	import {
		CapaIcon,
		ExcecutionIcon,
		FindingsIcon,
		Flight,
		Hotel,
		PlanningIcon,
		ReportIcon,
		Home,
		TransactionIcon
	} from '$lib/components/icons';
	import { currentPage } from '$lib/helpers/page-helper';
	import  ChevronDown from '@lucide/svelte/icons/chevron-down';
	import  ChevronRight  from '@lucide/svelte/icons/chevron-right';

	// State untuk menu yang terbuka
	let openMenus = $state<Record<string, boolean>>({
		planning: false
	});

	// Fungsi untuk toggle menu
	function toggleMenu(menuName: string) {
		openMenus = {
			...openMenus,
			[menuName]: !openMenus[menuName]
		};
	}

	const menuItems = [
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: Home,
			children: []
		},
		{
			name: 'Transaction',
			href: '/transaction',
			icon: TransactionIcon,
			children: []
		},
		{
			name: 'Report',
			href: '/report',
			icon: ReportIcon,
			children: []
		}
	];
</script>

<div class="py-2">
	<div class="px-4 py-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
		Application
	</div>
	<nav class="flex flex-col gap-1">
		{#each menuItems as item (item.name)}
			{@const isActive =
				currentPage(page.url.pathname) === item.href ||
				(item.children || []).some((child) => currentPage(page.url.pathname) === child?.href)}
			{@const hasChildren = item.children && item.children.length > 0}
			{@const isOpen = openMenus[item.name.toLowerCase()]}

			<div class="relative">
				{#if hasChildren}
					<button
						class="flex w-full items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200
							{isActive
							? 'bg-primary hover:bg-primary/80 text-white'
							: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
						onclick={() => toggleMenu(item.name.toLowerCase())}
						title={item.name}
					>
						<div class="flex items-center gap-3">
							<item.icon class="h-5 w-5" />
							<span class="truncate">{item.name}</span>
						</div>
						{#if isOpen}
							<ChevronDown class="h-4 w-4 transition-transform duration-200" />
						{:else}
							<ChevronRight class="h-4 w-4 transition-transform duration-200" />
						{/if}
					</button>

					<!-- {#if isOpen}
						<div class="mt-1 mb-1 ml-6 overflow-hidden border-l border-gray-200 pl-2">
							<div class="animate-fade-in flex flex-col gap-1">
								{#each item.children as child (child.name)}
									{@const isChildActive = currentPage(page.url.pathname) === child.href}
									<a
										href={child?.href}
										class="flex items-center rounded-md px-4 py-2 text-sm transition-colors duration-200
											{isChildActive
											? 'bg-primary/10 text-primary font-medium'
											: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
										title={child.name}
									>
										<span class="truncate pl-5">{child.name}</span>
									</a>
								{/each}
							</div>
						</div>
					{/if} -->
				{:else}
					<a
						href={item.href}
						class="flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200
							{isActive
							? 'bg-primary hover:bg-primary/80 text-white'
							: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}"
						title={item.name}
					>
						<item.icon class="h-5 w-5" />
						<span class="truncate">{item.name}</span>
					</a>
				{/if}
			</div>
		{/each}
	</nav>
</div>

<style>
	/* Animasi untuk fade in */
	.animate-fade-in {
		animation: fadeIn 0.2s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
