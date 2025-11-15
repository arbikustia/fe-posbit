<!-- src/routes/unauthorized/+page.svelte -->
<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import dayjs from 'dayjs';
	import { Button } from '@/components/ui/button';

	function goToDashboard() {
		goto('/dashboard');
	}

	function goToLogin() {
		goto('/auth/login');
	}

	function goBack() {
		// Cek apakah ada history
		if (window.history.length > 1) {
			window.history.back();
		} else {
			// Fallback ke dashboard jika tidak ada history
			goto('/dashboard');
		}
	}

	let isLoading = $state(false);

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
		} catch (error) {
			window.location.href = '/auth/login';
		}
	};
</script>

<svelte:head>
	<title>Akses Ditolak - Unauthorized</title>
	<meta name="description" content="Anda tidak memiliki izin untuk mengakses halaman ini" />
</svelte:head>

<div
	class="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-8"
>
	<div
		class="w-full max-w-md transform rounded-2xl bg-white p-8 text-center shadow-xl transition-transform duration-300 hover:scale-[1.02]"
	>
		<!-- Icon Container -->
		<div
			class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 ring-4 ring-red-50"
		>
			<svg
				class="h-12 w-12 text-red-500"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
				/>
			</svg>
		</div>

		<!-- Title & Message -->
		<h1 class="mb-3 text-3xl font-bold text-gray-900">Akses Ditolak</h1>
		<p class="mb-2 text-gray-600">Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.</p>
		<p class="mb-6 text-sm text-gray-500">
			Silakan hubungi administrator jika Anda merasa ini adalah kesalahan.
		</p>

		<!-- Error Code -->
		<div
			class="mb-6 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600"
		>
			<svg class="mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
			Error 403 - Forbidden
		</div>
		<div>
            <Button onclick={goBack}>Back to previouse page</Button>
			<Button variant="destructive" onclick={manualLogout}>Back to Login</Button>
		</div>
	</div>

	<!-- Footer -->
	<div class="mt-8 text-center">
		<p class="text-xs text-gray-400">
			© {dayjs().year()} Bantuit. All rights reserved.
		</p>
	</div>
</div>

<style>
	/* Custom animations */
	button {
		transition: all 0.2s ease-in-out;
	}

	button:hover {
		transform: translateY(-1px);
	}

	/* Smooth appearance */
	div:first-child {
		animation: fadeIn 0.5s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
