<script lang="ts">
	import LayoutNavBarMenuItem from './layout-navbar-menu-item.svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<nav class="flex items-center justify-center">
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
	<LayoutNavBarMenuItem href="/transaction" label={'Transaction'}>
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
	<LayoutNavBarMenuItem href="/report" label={'Report'}>
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
	<LayoutNavBarMenuItem href="/master/location" label={'Location'}>
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
	<LayoutNavBarMenuItem href="/master/category" label={'Category'}>
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
	<LayoutNavBarMenuItem href="/master/product" label={'Product'}>
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
	<LayoutNavBarMenuItem href="/master/user" label={'User'}>
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
