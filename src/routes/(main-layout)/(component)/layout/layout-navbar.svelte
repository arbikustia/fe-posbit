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
		<a href="/"> <img class="block h-8 w-auto" src={logoSrc} alt="Opsigo" /></a>

		<!-- NAV BAR CENTER -->
		<NavBarMenu />

		<!-- NAV BAR RIGHT -->
		<div class="nav-right">
			<!-- Manage booking -->
			<LayoutNavBarMenuItem href="/manage-booking" label={m.bookings()}>
				<svg
					slot="icon"
					class="size-6!"
					xmlns="http://www.w3.org/2000/svg"
					width="144"
					height="144"
					viewBox="0 0 20 20"
				>
					<path
						fill="currentColor"
						d="M5.75 3h8.5A2.75 2.75 0 0 1 17 5.75v8.5A2.75 2.75 0 0 1 14.25 17h-4.129l-1-1h5.129A1.75 1.75 0 0 0 16 14.25v-8.5A1.75 1.75 0 0 0 14.25 4h-8.5A1.75 1.75 0 0 0 4 5.75v3.277a4.5 4.5 0 0 0-1 .23V5.75A2.75 2.75 0 0 1 5.75 3M9.5 14a.5.5 0 0 1 0-1h4a.5.5 0 0 1 0 1zm-2-6.75a.75.75 0 1 1-1.5 0a.75.75 0 0 1 1.5 0m2-.25a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm0 3a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1zm-5 7c.786 0 1.512-.26 2.096-.697l2.55 2.55a.5.5 0 1 0 .708-.707l-2.55-2.55A3.5 3.5 0 1 0 4.5 17m0-1a2.5 2.5 0 1 1 0-5a2.5 2.5 0 0 1 0 5"
					/>
				</svg>
			</LayoutNavBarMenuItem>
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
