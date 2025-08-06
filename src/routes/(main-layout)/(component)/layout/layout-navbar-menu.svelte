<script lang="ts">
	import LayoutNavBarMenuItem from './layout-navbar-menu-item.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<nav class="flex items-center justify-center">
	<LayoutNavBarMenuItem href="/" label={m.home()}>
		<svg
			class="size-5!"
			slot="icon"
			xmlns="http://www.w3.org/2000/svg"
			width="100"
			height="100"
			viewBox="0 0 22 20"
		>
			<path
				fill="currentColor"
				d="m12.707 2.293l9 9c.63.63.184 1.707-.707 1.707h-1v6a3 3 0 0 1-3 3h-1v-7a3 3 0 0 0-2.824-2.995L13 12h-2a3 3 0 0 0-3 3v7H7a3 3 0 0 1-3-3v-6H3c-.89 0-1.337-1.077-.707-1.707l9-9a1 1 0 0 1 1.414 0M13 14a1 1 0 0 1 1 1v7h-4v-7a1 1 0 0 1 .883-.993L11 14z"
			/>
		</svg>
	</LayoutNavBarMenuItem>
	<LayoutNavBarMenuItem href="/dashboard" label={'Dashboard'}>
		<svg
			class="size-5!"
			slot="icon"
			xmlns="http://www.w3.org/2000/svg"
			width="100"
			height="100"
			viewBox="0 0 22 20"
		>
			<path fill="currentColor" d="M3 13h8V3H3zm0 8h8v-6H3zm10 0h8V11h-8zm0-18v6h8V3z" />
		</svg>
	</LayoutNavBarMenuItem>
</nav>
