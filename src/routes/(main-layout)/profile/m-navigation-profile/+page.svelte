<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Sheet from '$lib/components/ui/sheet';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import { currentPage } from '$lib/helpers/page-helper';
	import { page } from '$app/state';
	import { cn } from '$lib/utils';
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
	import { MLanguageSwitch } from '../../(component)/language-switch';
	import { ThemeCostumizer } from '../../(component)/theme-costumizer';
	import Icon from '@iconify/svelte';

	let { open = $bindable() } = $props();

	const sidebarProfileItems = [
		{
			icon: User,
			label: m.my_profile(),
			href: '/profile?view=my-profile'
		},
		{
			icon: Reset,
			label: m.security_and_otp(),
			href: '/profile?view=security-and-otp'
		},
		{
			icon: History,
			label: m.Company(),
			href: '/master/company'
		},
		{
			icon: People,
			label: m.traveler_profile(),
			href: '/master/traveler-profile'
		}
	];
	const sidebarSettingsItems = [
		{
			icon: History,
			label: m.notification(),
			href: '/'
		}
	];
	const sidebarOthersItems = [
		{
			icon: Information,
			label: m.privacy_policy(),
			href: '/privacy-policy'
		},
		{
			icon: Document,
			label: m.disclaimer(),
			href: '/disclaimer'
		},
		{
			icon: DocumentSearch,
			label: m.about_us(),
			href: '/'
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
</script>

<div class="flex h-full w-full flex-col justify-between">
	<div class="flex-1">
		<div class="fixed top-0 z-50 flex w-full justify-between bg-white p-2">
			<img src="/images/opsigo-logo.png" alt="Opsigo" class="h-8" />
		</div>
		<Separator class="mb-4" />
		<div class="flex items-center gap-x-2 px-2">
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
				<div class="text-sm text-gray-500">{$userStore?.userInfo.email}</div>
				<div class="flex items-center gap-2 text-sm text-gray-500">
					<Icon icon="uil:building" width="16" height="16" style="color: #777" />
					<span>RSP (Reka Sinergi Pratama)</span>
				</div>
			</div>
		</div>
	</div>
	<div class="mt-4 mb-2 h-2 bg-gray-100"></div>
	<div class="flex h-full flex-col justify-between overflow-y-auto px-2">
		<p class="px-2 text-sm font-medium text-neutral-500">Profile</p>
		<ul>
			{#each sidebarProfileItems as { icon, label, href }, i}
				{@const isActive = href === '/' ? current === href || current === '' : current === href}
				<li
					class={cn('px-2 py-1', {
						'bg-primary/10': isActive
					})}
				>
					<a
						{href}
						class={cn('flex items-center justify-between gap-2 font-semibold text-gray-700', {
							'text-primary': isActive
						})}
						onclick={handleClose}
					>
						<span>{label}</span>
						<Icon icon="weui:arrow-outlined" width="12" height="24" style="color: #777" />
					</a>
				</li>
			{/each}
		</ul>
		<p class="mt-4 px-2 text-sm font-medium text-neutral-500">Settings</p>
		<MLanguageSwitch />
		<ThemeCostumizer />
		<ul>
			{#each sidebarSettingsItems as { icon, label, href }, i}
				{@const isActive = href === '/' ? current === href || current === '' : current === href}
				<li
					class={cn('px-2 py-1', {
						'bg-primary/10': isActive
					})}
				>
					<a
						{href}
						class={cn('flex items-center justify-between gap-2 font-semibold text-gray-600', {
							'text-primary': isActive
						})}
						onclick={handleClose}
					>
						<span>{label}</span>
						<Icon icon="weui:arrow-outlined" width="12" height="24" style="color: #777" />
					</a>
				</li>
			{/each}
		</ul>

		<p class="mt-4 px-2 text-sm font-medium text-neutral-500">Others</p>
		<ul>
			{#each sidebarOthersItems as { icon, label, href }, i}
				{@const isActive = href === '/' ? current === href || current === '' : current === href}
				<li
					class={cn('px-2 py-1', {
						'bg-primary/10': isActive
					})}
				>
					<a
						{href}
						class={cn('flex items-center justify-between gap-2 font-semibold text-gray-600', {
							'text-primary': isActive
						})}
						onclick={handleClose}
					>
						<span>{label}</span>
						<Icon icon="weui:arrow-outlined" width="12" height="24" style="color: #777" />
					</a>
				</li>
			{/each}
			<form method="POST" use:enhance={logout} action="/api/logout" class="flex items-center px-1">
				<Button
					variant="ghost"
					type="submit"
					class={cn(
						'text-md flex w-full items-center justify-between gap-2 p-0 px-1 font-semibold text-gray-600'
					)}
					onclick={handleClose}
				>
					<span>Logout</span>
				</Button>
				<Icon icon="weui:arrow-outlined" width="22" height="22" style="color: #777" />
			</form>
		</ul>
	</div>
</div>
