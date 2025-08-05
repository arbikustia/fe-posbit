<script lang="ts">
	import ThemeCostumizer from '../theme-costumizer/theme-costumizer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { currentPage } from '$lib/helpers/page-helper';
	import { page } from '$app/state';
	import { cn, themeSrcLogo } from '$lib/utils';
	import { userStore } from '$lib/stores/userStore';
	import {
		Home,
		DocumentSearch,
		Document,
		Help,
		Information,
		Close,
		Flight,
		Hotel,
		Train,
		Insurance,
		People,
		Reset,
		User,
		History
	} from '$lib/components/icons';
	import * as m from '$lib/paraglide/messages.js';
	import MLanguageSwitch from '../language-switch/m-language-switch.svelte';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';

	let { open = $bindable() } = $props();

	const sidebarItems = [
		{
			icon: User,
			label: m.my_profile(),
			href: '/profile/m-navigation-profile'
		},
		{
			icon: Home,
			label: m.home(),
			href: '/'
		},
		{
			icon: Flight,
			label: m.flight(),
			href: '/flight'
		},
		{
			icon: Hotel,
			label: 'Hotel',
			href: '/hotel'
		},
		{
			icon: Train,
			label: m.train(),
			href: '/train'
		},
		{
			icon: Insurance,
			label: m.insurance(),
			href: '/insurance'
		},
		{
			icon: DocumentSearch,
			label: m.bookings(),
			href: '/manage-booking'
		},
		{
			icon: Document,
			label: m.disclaimer(),
			href: '/disclaimer'
		},
		{
			icon: Information,
			label: m.privacy_policy(),
			href: '/privacy-policy'
		}
	];

	const current = $derived(currentPage(page.url.pathname));

	function handleClose() {
		open = false;
	}

	const logout: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				window.location.href = result.location;
				handleClose();
			}
		};
	};

	const logoSrc = $derived(themeSrcLogo($themeConfigStore.logoType));
</script>

<Sheet.Root bind:open>
	<Sheet.Portal>
		<Sheet.Content
			side="left"
			data-sidebar="sidebar"
			data-mobile="true"
			class="text-sidebar-foreground bg-sidebar w-full p-0 [&>button]:hidden"
		>
			<div class="flex h-full w-full flex-col justify-between">
				<div class="flex-1">
					<div class="flex justify-between p-2">
						<img src={logoSrc} alt="Opsigo" class="h-8" />
						<Button variant="ghost" class="p-2" onclick={handleClose}>
							<Close class="h-6! w-6!" /></Button
						>
					</div>
					<Separator class="mb-4" />
					<div class="flex gap-x-2 px-2">
						<svg
							class="size-10!"
							xmlns="http://www.w3.org/2000/svg"
							width="144"
							height="144"
							viewBox="0 0 256 256"
						>
							<g fill="currentColor">
								<path
									d="M224 128a95.76 95.76 0 0 1-31.8 71.37A72 72 0 0 0 128 160a40 40 0 1 0-40-40a40 40 0 0 0 40 40a72 72 0 0 0-64.2 39.37A96 96 0 1 1 224 128"
									opacity="0.2"
								/>
								<path
									d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24M74.08 197.5a64 64 0 0 1 107.84 0a87.83 87.83 0 0 1-107.84 0M96 120a32 32 0 1 1 32 32a32 32 0 0 1-32-32m97.76 66.41a79.66 79.66 0 0 0-36.06-28.75a48 48 0 1 0-59.4 0a79.66 79.66 0 0 0-36.06 28.75a88 88 0 1 1 131.52 0"
								/>
							</g>
						</svg>
						<div>
							<div>{$userStore?.userInfo.fullName}</div>
							<div class="text-sm text-(--sidebar-foreground)/80">{$userStore?.userInfo.email}</div>
						</div>
					</div>
				</div>
				<div class="mt-4 mb-2 h-2 bg-(--sidebar-accent)"></div>
				<div class="flex h-full flex-col justify-between overflow-y-auto">
					<ul>
						{#each sidebarItems as { icon, label, href }, i}
							{@const isActive =
								href === '/' ? current === href || current === '' : current === href}
							{@const Icon = icon}
							<li
								class={cn('px-2 py-2', {
									'bg-primary/10': isActive && $themeConfigStore.navigationColor === 'default',
									'bg-sidebar-accent': isActive && $themeConfigStore.navigationColor !== 'default'
								})}
							>
								<a
									{href}
									class={cn(
										'flex items-center gap-2 font-semibold text-(--sidebar-foreground)/80',
										{
											'text-primary': isActive && $themeConfigStore.navigationColor === 'default'
										}
									)}
									onclick={handleClose}
								>
									<Icon class="h-6! w-6!" />
									<span>{label}</span>
								</a>
							</li>
						{/each}
					</ul>
					<div class="space-y-2 p-2">
						<MLanguageSwitch />
						<ThemeCostumizer />
						<form method="POST" use:enhance={logout} action="/api/logout">
							<Button type="submit" variant="outline" class="mt-5 w-full text-red-500"
								>Logout</Button
							>
						</form>
					</div>
				</div>
			</div>
		</Sheet.Content>
	</Sheet.Portal>
</Sheet.Root>
