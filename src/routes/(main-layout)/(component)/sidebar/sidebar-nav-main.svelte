<script lang="ts">
	import { page } from '$app/state';
	import { Flight, Hotel, Insurance, Train } from '$lib/components/icons';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { currentPage } from '$lib/helpers/page-helper';

	const newBookingItems = [
		{
			name: 'Flight',
			href: '/flight',
			icon: Flight
		},
		{
			name: 'Hotel',
			href: '/hotel',
			icon: Hotel
		},
		{
			name: 'Train',
			href: '/train',
			icon: Train
		},
		{
			name: 'Insurance',
			href: '/insurance',
			icon: Insurance
		}
	];

	let bookingItems = [
		{
			name: 'Manage Booking',
			href: '/manage-booking'
		},
		{
			name: 'Transactional Report',
			href: '/transactional-report'
		}
	];

	let mainItems = [
		{
			name: 'Dashboard',
			href: '/dashboard'
		}
	];
</script>

<Sidebar.Group>
	<Sidebar.Menu>
		{#each mainItems as item (item.name)}
			{@const isActive = currentPage(page.url.pathname) === item.href}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton {isActive}>
					{#snippet child({ props })}
						<a {...props} href={item.href}>
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
	<Sidebar.GroupLabel>New Booking</Sidebar.GroupLabel>
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

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.Menu>
		{#each bookingItems as item (item.name)}
			{@const isActive = currentPage(page.url.pathname) === item.href}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton {isActive}>
					{#snippet child({ props })}
						<a {...props} href={item.href}>
							<span>{item.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
