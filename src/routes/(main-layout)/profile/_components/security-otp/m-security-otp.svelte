<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import * as Form from '$lib/components/ui/form';
	import type { securitySchema } from './schema';
	import { Input } from '$lib/components/ui/input';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';

	let showCurrent = $state(false);
	let showNew = $state(false);
	let showRetype = $state(false);

	function toggleShow(field: 'current' | 'new' | 'retype') {
		if (field === 'current') showCurrent = !showCurrent;
		if (field === 'new') showNew = !showNew;
		if (field === 'retype') showRetype = !showRetype;
	}

	type SecurityFormProps = {
		form: SuperForm<z.infer<typeof securitySchema>>;
	};

	let { form }: SecurityFormProps = $props();

	const { form: formData, enhance, errors } = form;

	// Function to handle form reset
	function handleCancel() {
		$formData.currentPassword = '';
		$formData.newPassword = '';
		$formData.reTypeNewPassword = '';
	}
</script>

<MOSGAppBar class="bg-blue-800 text-neutral-50">
	{#snippet leftContent()}
		<div class="w-[80vw] text-center text-lg font-semibold text-neutral-50">Change Password</div>
	{/snippet}
</MOSGAppBar>

<Card.Root>
	<Card.Content>
		<form method="POST" use:enhance>
			<div class="mx-auto mt-5 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
				<!-- Change Password -->
				<div>
					<div class="space-y-4 border-b-2 border-neutral-100 pb-5">
						<!-- Current Password Field -->
						<div class="relative">
							<Form.Field {form} name="currentPassword">
								<Form.Control>
									<Form.Label class="text-sm font-medium text-gray-700">
										Current Password <span class="text-red-500">*</span>
									</Form.Label>
									<div class="relative">
										<Input
											type={showCurrent ? 'text' : 'password'}
											placeholder="Enter current password"
											bind:value={$formData.currentPassword}
											class="pr-10 {$errors.currentPassword
												? 'border-red-500 focus:border-red-500'
												: ''}"
										/>
										<button
											type="button"
											class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-hidden"
											onclick={() => toggleShow('current')}
										>
											<Icon
												icon={showCurrent ? 'mdi-light:eye-off' : 'iconamoon:eye-thin'}
												width="20"
												height="20"
												style="color: #6b7280"
											/>
										</button>
									</div>
								</Form.Control>
								<Form.FieldErrors class="mt-1 text-sm text-red-600" />
							</Form.Field>
						</div>

						<!-- New Password Field -->
						<div class="relative">
							<Form.Field {form} name="newPassword">
								<Form.Control>
									<Form.Label class="text-sm font-medium text-gray-700">
										New Password <span class="text-red-500">*</span>
									</Form.Label>
									<div class="relative">
										<Input
											type={showNew ? 'text' : 'password'}
											placeholder="Enter new password (min. 8 characters)"
											bind:value={$formData.newPassword}
											class="pr-10 {$errors.newPassword
												? 'border-red-500 focus:border-red-500'
												: ''}"
										/>
										<button
											type="button"
											class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-hidden"
											onclick={() => toggleShow('new')}
										>
											<Icon
												icon={showNew ? 'mdi-light:eye-off' : 'iconamoon:eye-thin'}
												width="20"
												height="20"
												style="color: #6b7280"
											/>
										</button>
									</div>
								</Form.Control>
								<Form.FieldErrors class="mt-1 text-sm text-red-600" />
							</Form.Field>
						</div>

						<!-- Re-type Password Field -->
						<div class="relative">
							<Form.Field {form} name="reTypeNewPassword">
								<Form.Control>
									<Form.Label class="text-sm font-medium text-gray-700">
										Re-Type Password <span class="text-red-500">*</span>
									</Form.Label>
									<div class="relative">
										<Input
											type={showRetype ? 'text' : 'password'}
											placeholder="Re-enter new password"
											bind:value={$formData.reTypeNewPassword}
											class="pr-10 {$errors.reTypeNewPassword
												? 'border-red-500 focus:border-red-500'
												: ''}"
										/>
										<button
											type="button"
											class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-hidden"
											onclick={() => toggleShow('retype')}
										>
											<Icon
												icon={showRetype ? 'mdi-light:eye-off' : 'iconamoon:eye-thin'}
												width="20"
												height="20"
												style="color: #6b7280"
											/>
										</button>
									</div>
								</Form.Control>
								<Form.FieldErrors class="mt-1 text-sm text-red-600" />
							</Form.Field>
						</div>

						<!-- General Form Errors -->
						{#if $errors._errors}
							<div class="rounded-md border border-red-200 bg-red-50 p-3">
								{#each $errors._errors as error}
									<p class="text-sm text-red-600">{error}</p>
								{/each}
							</div>
						{/if}

						<!-- Buttons -->
						<div class="flex items-center justify-end gap-4 pt-2">
							<Button
								type="button"
								variant="outline"
								class="text-sm text-gray-500 hover:underline"
								onclick={handleCancel}
							>
								Cancel
							</Button>
							<Button type="submit" class="rounded px-4 py-2 text-sm">Save Changes</Button>
						</div>
					</div>
				</div>

				<!-- MFA -->
				<div>
					<h2 class="mb-4 text-base font-semibold">Multifactor Authentication</h2>

					<div class="space-y-6 text-sm">
						<div class="flex flex-col items-start">
							<span class="text-gray-700">Current Status</span>
							<span class="flex items-center gap-1 text-[#4CAF50]">
								<Icon
									icon="lets-icons:check-ring-round"
									width="24"
									height="24"
									style="color: #4CAF50"
								/>
								Enabled
							</span>
						</div>
						<div>
							<span class="font-semibold text-black">OTP will be sent to:</span>
							<p class="text-gray-600">Mobile Phone Authenticator</p>
						</div>
					</div>
				</div>
			</div>
		</form>
	</Card.Content>
</Card.Root>
