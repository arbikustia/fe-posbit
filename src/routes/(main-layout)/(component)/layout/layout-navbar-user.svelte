<script lang="ts">
	import { browser } from '$app/environment';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { UserInfo } from '$lib/types/UserLogin';
	import { userService } from '@/services/userService';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Loader from '@lucide/svelte/icons/loader';
	import { onMount } from 'svelte';

	let { userInfo }: { userInfo: UserInfo | undefined } = $props();

	// Gunakan $state() untuk reactive state
	let isLoading = $state(false);

	// Fungsi untuk menghapus cookies dari client side
	const deleteClientCookies = () => {
		document.cookie.split(';').forEach((cookie) => {
			const name = cookie.split('=')[0].trim();
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
		});

		const cookiesToDelete = ['user_info', 'username', 'theme', 'language'];
		cookiesToDelete.forEach((name) => {
			document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
		});
	};

	// Fungsi untuk menghapus semua storage
	const clearAllStorage = () => {
		localStorage.clear();
		sessionStorage.clear();

		if ('indexedDB' in window) {
			indexedDB.databases?.().then((databases) => {
				databases.forEach((db) => {
					if (db.name) indexedDB.deleteDatabase(db.name);
				});
			});
		}
	};

	// Logout function lengkap
	const handleLogout = async () => {
		if (isLoading) return;

		try {
			// Set loading state - ini akan trigger reaksi
			isLoading = true;

			// Beri sedikit delay agar UI sempat update
			await new Promise((resolve) => setTimeout(resolve, 50));

			// 1. Hapus client-side data
			clearAllStorage();
			deleteClientCookies();

			// 2. Panggil server untuk hapus httpOnly cookies
			const response = await fetch('/?/logout', {
				method: 'POST'
			});

			if (response.ok) {
				window.location.href = '/auth/login';
			} else {
				window.location.href = '/auth/login';
			}
		} catch (error) {
			console.error('Logout error:', error);
			window.location.href = '/auth/login';
		}
		// Hapus finally block karena redirect akan terjadi
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
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class={buttonVariants({
			variant: 'ghost',
			class:
				'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative flex h-full items-center rounded-none '
		})}
	>
		<svg
			class="size-7!"
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

		<div>{getCookie('username') || 'superadmin'}</div>

		<ChevronDown class="size-4 " />
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class="w-56" align="end">
		<DropdownMenu.Label class="font-normal">
			<div class="flex flex-col space-y-1">
				<p class=" leading-none font-medium">{getCookie('username') || 'superadmin'}</p>
				<p class="text-md text-muted-foreground leading-none">{email}</p>
			</div>
		</DropdownMenu.Label>
		<DropdownMenu.Separator />

		<DropdownMenu.Item disabled={isLoading}>
			<button
				onclick={handleLogout}
				class="flex w-full items-center justify-between gap-2 p-2 text-left font-normal focus-visible:outline-hidden"
				disabled={isLoading}
			>
				<span>{isLoading ? 'Logging out...' : 'Logout'}</span>
				{#if isLoading}
					<Loader class="size-4 animate-spin" />
				{/if}
			</button>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
