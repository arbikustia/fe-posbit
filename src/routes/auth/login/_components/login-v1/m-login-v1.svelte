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
	import { DisclaimerDialog } from './_components/dialog-disclaimer';
	import { PrivacyPolicyDialog } from './_components/dialog-privacy-policy';

	let { data }: { data: PageData } = $props();

	const images = [
		'https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80',
		'https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80',
		'https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80'
	];

	let currentImageIndex = $state(0);
	// svelte-ignore non_reactive_update
	let isCarouselActive = images.length > 1;
	let autoSlideInterval: any;
	let isTransitioning = $state(false);
	let currentTab = $state('default');
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
	<div
		class="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
	>
		<div class="mx-auto w-full max-w-sm lg:w-96">
			<div>
				<img class="h-12 w-auto" src="/images/logo-bantuit-text.png" alt="Your Company" />
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
						<!-- <div class="mt-2 text-sm text-neutral-500">
							By continuing, you're confirming that you've read our
							<span>
								<Button variant="link" class="p-0" onclick={() => (currentTab = 'disclaimer')}>
									<DisclaimerDialog />
								</Button>
							</span>
							and
							<span>
								<Button variant="link" class="p-0" onclick={() => (currentTab = 'privacy-policy')}>
									<PrivacyPolicyDialog />
								</Button>
							</span>
						</div> -->
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
