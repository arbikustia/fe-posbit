<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { loginSchema } from '../../schema';
	import * as Form from '$lib/components/ui/form/index.js';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import type { PageData } from '../../$types';
	import * as Alert from '$lib/components/ui/alert';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import { fly, slide } from 'svelte/transition';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';

	let { data }: { data: PageData } = $props();

	let errorMsg = $state<string>();
	let showPassword = $state(false); // State untuk toggle visibility password

	const form = superForm(data.form, {
		validators: zod(loginSchema),
		resetForm: false,
		onSubmit() {
			errorMsg = undefined;
			console.log(data.form,'ok')
		},
		onResult({ result }) {
			if (result.type === 'failure' && result.status === 500) {
				errorMsg = result.data?.message;
			}
		}
	});

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

	const { form: formData, enhance, submitting } = form;

	onMount(() => {
		deleteClientCookies()
		clearAllStorage()
		try {
			const el = document.documentElement;

			// 🔹 Fullscreen untuk semua browser
			if (el.requestFullscreen) {
				el.requestFullscreen();
			} else if ((el as any).webkitRequestFullscreen) {
				// Safari / iPadOS / older WebKit
				(el as any).webkitRequestFullscreen();
			} else if ((el as any).msRequestFullscreen) {
				// Old Microsoft Edge / IE
				(el as any).msRequestFullscreen();
			}
		} catch (e) {
			console.warn('Gagal masuk fullscreen:', e);
		}
	});
</script>

<div
	class="relative flex min-h-screen items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-5 sm:px-6 lg:px-8"
	style="background-image: url('/images/login-image.jpeg');"
>
	<!-- Overlay gelap -->
	<div class="absolute inset-0 bg-black/40"></div>

	<!-- Konten login -->
	<div class="relative z-10 w-full max-w-md space-y-8 rounded-xl bg-white py-5 shadow-md">
		<div class="text-center">
			<img class="mx-auto h-12 w-auto" src="/images/logo-bantuit-text.png" alt="Your Company" />
			<h2 class="text-lg tracking-tight text-gray-500">Sign in to your account</h2>
		</div>

		<div class="px-8 py-8">
			{#if !!errorMsg}
				<div class="mb-4" transition:fly>
					<Alert.Root variant="destructive">
						<CircleAlert class="size-4" />
						<Alert.Title>Error</Alert.Title>
						<Alert.Description>{errorMsg}</Alert.Description>
					</Alert.Root>
				</div>
			{/if}

			<form method="post" use:enhance class="space-y-1">
				<Form.Field {form} name="username">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Username</Form.Label>
							<Input placeholder="username" {...props} bind:value={$formData.username} />
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Form.Field {form} name="password">
					<Form.Control>
						{#snippet children({ props })}
							<Form.Label>Password</Form.Label>
							<div class="relative">
								<Input
									type={showPassword ? 'text' : 'password'}
									placeholder="Password"
									{...props}
									bind:value={$formData.password}
									class="pr-10"
								/>
								<button
									type="button"
									class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
									onclick={() => (showPassword = !showPassword)}
								>
									{#if showPassword}
										<Icon icon="lucide:eye-off" class="size-5" />
									{:else}
										<Icon icon="lucide:eye" class="size-5" />
									{/if}
								</button>
							</div>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>

				<Button type="submit" size="lg" class="w-full" disabled={$submitting}>
					{#if $submitting}
						<LoaderCircle class="animate-spin" />
					{:else}
						Login
					{/if}
				</Button>
			</form>
		</div>
	</div>
</div>
