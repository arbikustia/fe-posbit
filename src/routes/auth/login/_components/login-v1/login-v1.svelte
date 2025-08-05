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
	import { CircleAlert } from '@lucide/svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	import { OSGDisclaimer } from '$lib/components/disclaimer';
	import { goto } from '$app/navigation';
	import { OSGPrivacyPolicy } from '$lib/components/privacy-policy';
	import { fade } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

	const images = [
		'https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80',
		'https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80',
		'https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80'
	];

	let currentImageIndex = $state(0);
	// svelte-ignore non_reactive_update
	let swiperContainer: HTMLDivElement;
	let isCarouselActive = images.length > 1;
	let autoSlideInterval: any;
	let isTransitioning = $state(false);
	let currentTab = $state('default');
	const extendedImages = $derived([images[images.length - 1], ...images, images[0]]);

	const displayIndex = $derived(currentImageIndex + 1);

	let errorMsg = $state<string>();

	const form = superForm(data.form, {
		validators: zod(loginSchema),
		resetForm: false,
		onSubmit() {
			errorMsg = undefined;
		},
		onResult({ result }) {
			if (result.type === 'failure' && result.status === 500) {
				errorMsg = result.data?.message;
			}
		}
	});

	const { form: formData, enhance, submitting } = form;

	const goToNext = () => {
		if (isTransitioning) return;
		isTransitioning = true;

		currentImageIndex++;

		setTimeout(() => {
			if (currentImageIndex >= images.length) {
				isTransitioning = false;
				currentImageIndex = 0;
			} else {
				isTransitioning = false;
			}
		}, 500);

		resetAutoSlide();
	};

	const goToPrev = () => {
		if (isTransitioning) return;
		isTransitioning = true;

		currentImageIndex--;

		setTimeout(() => {
			if (currentImageIndex < 0) {
				isTransitioning = false;
				currentImageIndex = images.length - 1;
			} else {
				isTransitioning = false;
			}
		}, 500);

		resetAutoSlide();
	};

	const goToSlide = (index: number) => {
		if (isTransitioning) return;
		currentImageIndex = index;
		resetAutoSlide();
	};

	const startAutoSlide = () => {
		if (!isCarouselActive) return;
		autoSlideInterval = setInterval(() => {
			goToNext();
		}, 5000);
	};

	const resetAutoSlide = () => {
		if (autoSlideInterval) {
			clearInterval(autoSlideInterval);
			startAutoSlide();
		}
	};

	const stopAutoSlide = () => {
		if (autoSlideInterval) {
			clearInterval(autoSlideInterval);
		}
	};

	onMount(() => {
		images.forEach((src) => {
			const img = new Image();
			img.src = src;
		});

		startAutoSlide();

		return () => {
			stopAutoSlide();
		};
	});
</script>

<div class="flex min-h-full bg-white">
	<!-- Ubah bagian carousel -->
	{#if currentTab == 'disclaimer'}
		<div class="relative hidden h-screen w-full flex-1 overflow-auto px-8 py-4 lg:block">
			<OSGDisclaimer hiddenClose={false} close={() => (currentTab = 'default')} />
		</div>
	{:else if currentTab == 'privacy-policy'}
		<div class="relative hidden h-screen w-full flex-1 overflow-auto px-8 py-4 lg:block">
			<OSGPrivacyPolicy hiddenClose={false} close={() => (currentTab = 'default')} />
		</div>
	{:else}
		<div class="relative hidden w-0 flex-1 lg:block">
			{#if isCarouselActive}
				<!-- svelte-ignore a11y_no_static_element_interactions -->
				<div
					class="relative flex h-screen w-auto items-center justify-center overflow-hidden"
					bind:this={swiperContainer}
					onmouseenter={stopAutoSlide}
					onmouseleave={startAutoSlide}
				>
					<div class="relative flex h-full w-full items-start justify-start">
						{#each extendedImages as image, index}
							<div
								class="absolute inset-0 flex items-start justify-start ease-in-out"
								class:transition-transform={isTransitioning}
								class:duration-500={isTransitioning}
								style="transform: translateX({(index - displayIndex) * 100}%)"
							>
								<img class="h-full w-auto" src={image} alt={`Slide ${index}`} />
							</div>
						{/each}
					</div>

					<button
						class="group absolute left-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/20 p-2 opacity-80 backdrop-blur-xs transition-all duration-200 hover:bg-white/30 hover:opacity-100"
						onclick={goToPrev}
					>
						<Icon
							icon="weui:arrow-filled"
							class="rotate-180"
							width="12"
							height="24"
							style="color: #242424"
						/>
					</button>

					<button
						class="group absolute right-4 top-1/2 z-10 -translate-y-1/2 transform rounded-full bg-white/20 p-2 opacity-80 backdrop-blur-xs transition-all duration-200 hover:bg-white/30 hover:opacity-100"
						onclick={goToNext}
					>
						<Icon icon="weui:arrow-filled" width="12" height="24" style="color: #242424" />
					</button>
				</div>
			{:else}
				<div class="absolute inset-0 flex h-screen items-center justify-center bg-gray-100">
					<img class="h-full w-auto object-contain" src={images[0]} alt="Login background" />
				</div>
			{/if}
		</div>
	{/if}

	<div
		class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
	>
		<div class="mx-auto w-full max-w-sm lg:w-96">
			<div>
				<img class="h-12 w-auto" src="/images/opsigo-logo.png" alt="Your Company" />
				<h2 class="mt-8 text-2xl/9 font-bold tracking-tight text-gray-900">
					Sign in to your account
				</h2>
			</div>

			<div class="mt-10">
				{#if !!errorMsg}
					<div class="mb-4" transition:fly>
						<Alert.Root variant="destructive">
							<CircleAlert class="size-4" />
							<Alert.Title>Error</Alert.Title>
							<Alert.Description>{errorMsg}</Alert.Description>
						</Alert.Root>
					</div>
				{/if}
				<div>
					<form method="post" use:enhance>
						<Form.Field {form} name="username">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Username</Form.Label>
									<Input placeholder="username" {...props} bind:value={$formData.username} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field class="mt-2" {form} name="password">
							<Form.Control>
								{#snippet children({ props })}
									<Form.Label>Password</Form.Label>
									<Input
										type="password"
										placeholder="Password"
										{...props}
										bind:value={$formData.password}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Button type="submit" size="lg" class="mt-5 w-full" disabled={$submitting}>
							{#if $submitting}
								<LoaderCircle class="animate-spin" />
							{:else}
								Login
							{/if}
						</Button>
					</form>
					<div class="mt-2 text-sm text-neutral-500">
						By continuing, you're confirming that you've read our
						<span>
							<Button
								type="button"
								variant="link"
								class="p-0"
								onclick={() => (currentTab = 'disclaimer')}
								>Disclaimer
							</Button>
						</span>
						and
						<span>
							<Button
								type="button"
								variant="link"
								class="p-0"
								onclick={() => (currentTab = 'privacy-policy')}
							>
								Privacy Policy
							</Button>
						</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
