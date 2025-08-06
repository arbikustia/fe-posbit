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
	import { fly, slide } from 'svelte/transition';

	let { data }: { data: PageData } = $props();

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
</script>

<div class="relative min-h-screen bg-white">
	<div class="absolute inset-0">
		<div class="absolute inset-0"></div>
	</div>

	<div class="relative flex min-h-screen items-center justify-center px-4 py-5 sm:px-6 lg:px-8">
		<div class="w-full max-w-md space-y-8 rounded-lg bg-white py-5">
			<div class="text-center">
				<img class="mx-auto h-12 w-auto" src="/images/logo-bantuit-text.png" alt="Your Company" />
				<h2 class="mt-6 text-3xl font-bold tracking-tight text-black">Sign in to your account</h2>
			</div>

			<div class=" px-8 py-8">
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
</div>
