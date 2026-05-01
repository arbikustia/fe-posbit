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
		Close,
		User,
		DashboardIcon,
		TransactionIcon,
		PurchaseIcon,
		MasterIcon,
		Sync
	} from '$lib/components/icons';
	import MLanguageSwitch from '../language-switch/m-language-switch.svelte';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import Loader from '@lucide/svelte/icons/loader';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { userService } from '@/services/userService';
	import { hasAccess, getUserRole } from '@/rbacUtils';
	import { ROLES } from '@/constants/permission';

	let { open = $bindable() } = $props();

	// State untuk loading logout
	let isLoading = $state(false);

	const user = {
		role: 'Cashier'
	};

	// Sidebar items with subpages
	const sidebarItems = $derived([
		{
			icon: DashboardIcon,
			label: 'Dashboard',
			href: '/dashboard',
			access: [ROLES.SUPERADMIN, ROLES.ADMIN] // Semua role bisa akses
		},
		{
			icon: MasterIcon,
			label: 'Master',
			href: '/master/user',
			children: [
				{
					label: 'User',
					href: '/master/user',
					childAccess: [ROLES.SUPERADMIN]
				},
				{
					label: 'Point',
					href: '/master/point',
					childAccess: [ROLES.SUPERADMIN]
				},
				{
					label: 'Customer',
					href: '/master/customer',
					childAccess: [ROLES.CASHIER, ROLES.SUPERADMIN]
				},
				{
					label: 'Item',
					href: '/master/item',
					childAccess: [ROLES.SUPERADMIN]
				}
			],
			access: [ROLES.SUPERADMIN, ROLES.CASHIER]
		},
		{
			icon: TransactionIcon,
			label: 'Transaction',
			href: '/transaction',
			access: [ROLES.SUPERADMIN, ROLES.CASHIER]
		},
		{
			icon: Sync,
			label: 'STO',
			href: '/sto',
			access: [ROLES.SUPERADMIN, ROLES.ADMIN]
		},
		{
			icon: PurchaseIcon,
			label: 'Purchase',
			href: '/purchase',
			access: [ROLES.SUPERADMIN, ROLES.ADMIN]
		},
		{
			icon: MasterIcon,
			label: 'Report',
			href: '/report/sales',
			children: [
				{
					label: 'Sales',
					href: '/report/sales',
					childAccess: [ROLES.CASHIER, ROLES.SUPERADMIN, ROLES.ADMIN]
				},
				{
					label: 'Invoice',
					href: '/report/purchase',
					childAccess: [ROLES.GUDANG, ROLES.SUPERADMIN, ROLES.ADMIN]
				},
				{
					label: 'Summary Shift',
					href: '/report/shift',
					childAccess: [ROLES.SUPERADMIN, ROLES.ADMIN]
				},
				{
					label: 'Monitoring Stock',
					href: '/report/monitoring-stock',
					childAccess: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.GUDANG]
				},
				{
					label: 'Monitoring Stock 2',
					href: '/report/monitoring-stock-2',
					childAccess: [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.GUDANG]
				}
			],
			access: [ROLES.SUPERADMIN, ROLES.CASHIER, ROLES.GUDANG, ROLES.ADMIN]
		}
	]);

	// Fungsi untuk memfilter sidebar items berdasarkan akses
	const filteredSidebarItems = $derived(
		sidebarItems.filter((item: any) => {
			// Cek akses utama
			if (!hasAccess(item.access)) return false;

			// Jika punya children, filter children yang bisa diakses
			if (item.children) {
				item.children = item.children.filter((child: any) => hasAccess(child.childAccess || []));
				// Jika tidak ada children yang bisa diakses, sembunyikan parent juga
				if (item.children.length === 0) return false;
			}

			return true;
		})
	);

	const current = $derived(currentPage(page.url.pathname));

	function handleClose() {
		open = false;
	}

	// Fungsi untuk menghapus cookies dari client side
	const deleteClientCookies = () => {
		// Hapus cookies yang tidak httpOnly
		document.cookie.split(';').forEach((cookie) => {
			const name = cookie.split('=')[0].trim();
			// Hapus dengan berbagai path dan domain
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
		});

		// Hapus specific cookies
		const cookiesToDelete = ['user_info', 'username', 'theme', 'language'];
		cookiesToDelete.forEach((name) => {
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
		});
	};

	// Fungsi untuk menghapus semua storage
	const clearAllStorage = () => {
		// Local Storage
		localStorage.clear();

		// Session Storage
		sessionStorage.clear();

		// IndexedDB (optional)
		if ('indexedDB' in window) {
			indexedDB.databases?.().then((databases) => {
				databases.forEach((db) => {
					if (db.name) indexedDB.deleteDatabase(db.name);
				});
			});
		}
	};

	// Manual logout function sebagai fallback
	const manualLogout = async () => {
		if (isLoading) return;

		try {
			isLoading = true;
			await new Promise((resolve) => setTimeout(resolve, 50));

			// Hapus client-side data
			clearAllStorage();
			deleteClientCookies();

			// Panggil server logout
			const response = await fetch('/api/logout', {
				method: 'POST'
			});

			if (response.ok) {
				window.location.href = '/auth/login';
			} else {
				window.location.href = '/auth/login';
			}
			handleClose();
		} catch (error) {
			console.error('Logout error:', error);
			window.location.href = '/auth/login';
		}
	};

	let email = $state('');

	function getCookie(name: string) {
		if (!browser) return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift();
		return null;
	}

	onMount(async () => {
		let username = getCookie('username') || 'superadmin';
		await userService
			.getPaged({
				PageNumber: 1,
				PageSize: 1000000,
				SearchTerm: ''
			})
			.then((res: any) => {
				let user = res.data.data.find((u: any) => u.username === username).email;
				email = user;
			});
	});

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
						<img src={logoSrc} alt="Bantuit" class="h-8" />
						<Button variant="ghost" class="p-2" onclick={handleClose}>
							<Close class="h-6! w-6!" />
						</Button>
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
							<div>{getCookie('username') || 'superadmin'}</div>
							<div class="text-sm text-(--sidebar-foreground)/80">{email}</div>
						</div>
					</div>
				</div>

				<div class="mt-4 mb-2 h-2 bg-(--sidebar-accent)"></div>
				<div class="flex h-full flex-col justify-between overflow-y-auto">
					<ul>
						{#each filteredSidebarItems as { icon, label, href, children }, i}
							{@const isActive =
								href === '/' ? current === href || current === '' : current === href}
							{@const Icon = icon}
							<li class="px-2 py-2">
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

								{#if children}
									<ul class="mt-1 ml-8 space-y-1">
										{#each children as child}
											{@const isChildActive = current === child.href}
											<li>
												<a
													href={child.href}
													class={cn('block text-sm text-(--sidebar-foreground)/70', {
														'text-primary font-semibold': isChildActive
													})}
													onclick={handleClose}
												>
													{child.label}
												</a>
											</li>
										{/each}
									</ul>
								{/if}
							</li>
						{/each}
					</ul>

					<div class="space-y-2 p-2">
						<Button
							variant="outline"
							class="mt-5 flex w-full items-center justify-center gap-2 text-red-500"
							onclick={manualLogout}
							disabled={isLoading}
						>
							{#if isLoading}
								<Loader class="h-4 w-4 animate-spin" />
								<span>Logging out...</span>
							{:else}
								<span>Logout</span>
							{/if}
						</Button>
					</div>
				</div>
			</div>
		</Sheet.Content>
	</Sheet.Portal>
</Sheet.Root>
