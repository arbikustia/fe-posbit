<script lang="ts">
	import { page } from '$app/state';
	import { People } from '$lib/components/icons';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { currentPage } from '$lib/helpers/page-helper';
	import  Newspaper  from '@lucide/svelte/icons/newspaper';

	const newBookingItems = [
		{
			name: 'Location',
			href: '/master/location',
			icon: Newspaper
		},
		{
			name: 'Category',
			href: '/master/category',
			icon: Newspaper
		},
		{
			name: 'Product',
			href: '/master/product',
			icon: Newspaper
		},
		{
			name: 'User',
			href: '/master/user',
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
