<script lang="ts">
	import { page } from '$app/state';
	import { Flight, Hotel, Insurance, Train } from '$lib/components/icons';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { currentPage } from '$lib/helpers/page-helper';

	let items = [
		{
			name: 'Privacy Policy',
			href: '/privacy-policy'
		},
		{
			name: 'Disclaimer',
			href: '/disclaimer'
		}
	];
</script>

<Sidebar.Group class="mt-auto group-data-[collapsible=icon]:hidden">
	<Sidebar.Menu>
		{#each items as item (item.name)}
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
