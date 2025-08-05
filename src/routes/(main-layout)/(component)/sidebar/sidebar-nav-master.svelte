<script lang="ts">
	import { page } from '$app/state';
	import { People } from '$lib/components/icons';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { currentPage } from '$lib/helpers/page-helper';
	import { Building, Newspaper } from '@lucide/svelte';

	const newBookingItems = [
		{
			name: 'Traveler Profile',
			href: '/master/traveler-profile',
			icon: People
		},
		{
			name: 'Company',
			href: '/master/company',
			icon: Building
		},
		{
			name: 'Article',
			href: '/master/article',
			icon: Newspaper
		}
	];
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Master</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each newBookingItems as item (item.name)}
			{@const isActive = currentPage(page.url.pathname) === item.href}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton {isActive} tooltipContent={item.name}>
					{#snippet child({ props })}
						<a {...props} href={item.href}>
							<item.icon />
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
