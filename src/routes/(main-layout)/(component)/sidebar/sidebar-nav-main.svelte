<script lang="ts">
	import { page } from '$app/state';
	import { CapaIcon, ExcecutionIcon, FindingsIcon, Flight, Hotel, PlanningIcon, ReportIcon } from '$lib/components/icons';
	import { currentPage } from '$lib/helpers/page-helper';
	import { ChevronDown, ChevronRight } from '@lucide/svelte';

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
			name: 'Planning',
			href: '/planning',
			icon: PlanningIcon,
			children: [
				{ name: 'Audit Plan', href: '/planning/audit-plan' },
				{ name: 'Audit Schedule', href: '/planning/audit-schedule' }
			]
		},
		// {
		// 	name: 'Audit Execution',
		// 	href: '/audit-execution',
		// 	icon: ExcecutionIcon,
		// 	children: []
		// },
		{
			name: 'Audit Findings',
			href: '/findings',
			icon: FindingsIcon,
			children: []
		},
		{
			name: 'CAPA',
			href: '/capa',
			icon: CapaIcon,
			children: [
				{ name: 'Corrective Action', href: '/capa/corrective-action' },
				{ name: 'Preventive Action', href: '/capa/preventive-action' }
			]
		},
			{
			name: 'Report',
			href: '/report',
			icon: ReportIcon,
			children: []
		},
	];
</script>

<div class="py-2">
	<div class="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
		Application
	</div>
	<nav class="flex flex-col gap-1">
		{#each menuItems as item (item.name)}
			{@const isActive = currentPage(page.url.pathname) === item.href || 
				(item.children || []).some(child => currentPage(page.url.pathname) === child.href)}
			{@const hasChildren = item.children && item.children.length > 0}
			{@const isOpen = openMenus[item.name.toLowerCase()]}
			
			<div class="relative">
				{#if hasChildren}
					<button 
						class="flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
							{isActive 
								? 'bg-primary text-white hover:bg-primary/80' 
								: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
						onclick={() => toggleMenu(item.name.toLowerCase())}
						title={item.name}
					>
						<div class="flex items-center gap-3">
							<item.icon class="w-5 h-5" />
							<span class="truncate">{item.name}</span>
						</div>
						{#if isOpen}
							<ChevronDown class="w-4 h-4 transition-transform duration-200" />
						{:else}
							<ChevronRight class="w-4 h-4 transition-transform duration-200" />
						{/if}
					</button>
					
					{#if isOpen}
						<div class="ml-6 pl-2 border-l border-gray-200 mt-1 mb-1 overflow-hidden">
							<div class="flex flex-col gap-1 animate-fade-in">
								{#each item.children as child (child.name)}
									{@const isChildActive = currentPage(page.url.pathname) === child.href}
									<a 
										href={child.href}
										class="flex items-center px-4 py-2 text-sm rounded-md transition-colors duration-200
											{isChildActive 
												? 'bg-primary/10 text-primary font-medium' 
												: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
										title={child.name}
									>
										<span class="truncate pl-5">{child.name}</span>
									</a>
								{/each}
							</div>
						</div>
					{/if}
				{:else}
					<a 
						href={item.href}
						class="flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200
							{isActive 
								? 'bg-primary text-white hover:bg-primary/80' 
								: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}"
						title={item.name}
					>
						<item.icon class="w-5 h-5" />
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