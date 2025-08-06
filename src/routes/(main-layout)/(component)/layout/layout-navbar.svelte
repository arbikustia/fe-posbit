<script lang="ts">
	import NavBarMenu from './layout-navbar-menu.svelte';
	import NavBarUser from './layout-navbar-user.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { UserInfo } from '$lib/types/UserLogin';
	import LayoutNavBarMenuItem from './layout-navbar-menu-item.svelte';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { themeSrcLogo } from '$lib/utils';
	let { userInfo }: { userInfo: UserInfo | undefined } = $props();

	const logoSrc = $derived(themeSrcLogo($themeConfigStore.logoType));
</script>

<nav
	class={[
		'navbar',
		$themeConfigStore.navigationColor === 'default'
			? 'bg-white'
			: 'bg-sidebar'
	]}
>
	<div class={`navbar-container navbar-${$themeConfigStore.navbar}`}>
		<!-- NAV BAR LEFT -->
		<a href="/"> <img class="block h-8 w-auto" src={logoSrc} alt="Bantuit" /></a>

		<!-- NAV BAR CENTER -->
		<NavBarMenu />

		<!-- NAV BAR RIGHT -->
		<div class="nav-right">
			<!-- Profile dropdown -->
			<NavBarUser {userInfo} />
		</div>
	</div>
</nav>

<style>
	@reference '$appCss';
	.navbar {
		@apply text-sidebar-foreground w-full shadow-md;
	}
	.navbar-container {
		@apply relative mx-auto flex items-center justify-between gap-5 px-4;
	}
	.nav-right {
		@apply flex items-center gap-2;
	}
	.navbar-1 {
		@apply max-w-6xl;
	}
	.navbar-2,
	.navbar-3 {
		@apply h-14 max-w-full;
	}
	.navbar-1 > .nav-right,
	.navbar-2 > .nav-right {
		@apply flex-1 justify-end;
	}
	:global {
		.navbar-3 > nav {
			@apply absolute top-0 right-0 bottom-0 left-0 mx-auto;
		}
		.navbar-3 > nav > .navbar-item {
			@apply py-2.5;
		}
		.navbar-3 > nav > .navbar-item > .wrap {
			@apply flex-col gap-1;
		}
	}
</style>
