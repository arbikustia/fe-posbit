<script lang="ts">
	import { page } from '$app/state';
	import { Flight, Hotel, Insurance, Train } from '$lib/components/icons';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { currentPage } from '$lib/helpers/page-helper';

	const newBookingItems = [
		{
			name: 'Home',
			href: '/',
			icon: Flight
		},
		{
			name: 'Dashboard',
			href: '/dashboard',
			icon: Hotel
		}
	];
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
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


