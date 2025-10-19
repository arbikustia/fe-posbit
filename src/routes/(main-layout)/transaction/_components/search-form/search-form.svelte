<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';

	let { variant = 'default' }: any = $props();

	import Icon from '@iconify/svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import dayjs from 'dayjs';
	import { onMount, onDestroy } from 'svelte';

	// Gunakan $state untuk reaktivitas di Svelte 5
	let currentTime = $state(dayjs().format('DD-MM-YYYY HH:mm:ss'));

	let timer: NodeJS.Timeout | null = null;

	onMount(() => {
		// Update setiap 1 detik
		timer = setInterval(() => {
			currentTime = dayjs().format('DD-MM-YYYY HH:mm:ss');
		}, 1000);
	});

	onDestroy(() => {
		if (timer) clearInterval(timer);
	});

	let paymentMethod = $state('cash');
	let paymentMethodeOpen = $state(false);

	const paymentOptions = [
		{ value: 'cash', label: 'Cash' },
		{ value: 'debit', label: 'Debit' }
	];
</script>

{#if variant === 'sticky'}
	{#snippet searchButton()}
		<Button
			onclick={() => goto('/invoice')}
			class={cn('h-10 w-full flex-none text-lg', {})}
			size="lg"
		>
			<span class="ml-1">Purchase</span>
		</Button>
	{/snippet}
	<Select.Root type="single" bind:value={paymentMethod} bind:open={paymentMethodeOpen}>
		<section class="bg-card sticky top-0 z-31 border-y shadow-sm">
			<div class="mx-auto max-w-6xl space-y-2 px-4 pt-2 pb-2">
				<div class="flex w-full flex-1 grid-cols-5 flex-row items-end justify-start gap-5">
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 flex h-9 w-fit items-center gap-2 rounded-md p-1 px-4 text-sm font-medium"
						>
							<Icon icon="solar:user-linear" width="14" height="14" class="text-primary" />
							superadmin
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 flex h-9 w-fit items-center rounded-md p-1 px-4 text-sm font-medium"
						>
							<div>{currentTime}</div>
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md text-sm font-medium"
						>
							<Select.Trigger
								class="text-primary bg-primary/10 relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md border-none p-1 px-4 text-sm font-medium shadow-none"
							>
								<span>{paymentOptions.find((p) => p.value === paymentMethod)?.label}</span>
							</Select.Trigger>

							<Select.Content>
								<Select.Group>
									{#each paymentOptions as option (option.value)}
										<Select.Item value={option.value}>{option.label}</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</div>
					</div>
				</div>
				<div class="grid w-full grid-cols-5 flex-row items-end justify-start gap-2">
					<!-- Customer Name -->
					<div class="flex flex-col items-start justify-start gap-1">
						<div class="h-auto w-full rounded-lg border border-gray-200">
							<Input
								placeholder="Customer Name"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
							/>
						</div>
					</div>

					<!-- Phone Number -->
					<div class="flex flex-col items-start justify-start gap-1">
						<div class="h-auto w-full rounded-lg border border-gray-200">
							<Input
								type="tel"
								placeholder="Phone Number"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
							/>
						</div>
					</div>

					<!-- Search Product -->
					<div class="flex flex-col items-start justify-start gap-1">
						<div class="h-auto w-full rounded-lg border border-gray-200">
							<Input
								placeholder="Search Product"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
							/>
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<div class="h-auto w-full rounded-lg border border-gray-200">
							<Input
								placeholder="Amount Received"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
							/>
						</div>
					</div>

					{@render searchButton()}
				</div>
			</div>
		</section>
	</Select.Root>
{:else if variant === 'default'}
	{#snippet searchButton()}
		<Button
			class={cn('h-12 w-full flex-none text-lg', {
				'min-h-11': variant === 'default'
			})}
			onclick={() => goto('/invoice')}
			size="lg"
		>
			<span class="ml-1">Purchase</span>
		</Button>
	{/snippet}
	<Select.Root type="single" bind:value={paymentMethod} bind:open={paymentMethodeOpen}>
		<section class="w-full">
			<Card.Root>
				<Card.Content class="flex w-full flex-col items-start space-y-2">
					<div class="flex w-full flex-1 grid-cols-5 flex-row items-end justify-start gap-5">
						<div class="flex flex-col items-start justify-start gap-1">
							<div
								class="text-primary bg-primary/10 flex h-9 w-fit items-center gap-2 rounded-md p-1 px-4 text-sm font-medium"
							>
								<Icon icon="solar:user-linear" width="14" height="14" class="text-primary" />
								superadmin
							</div>
						</div>
						<div class="flex flex-col items-start justify-start gap-1">
							<div
								class="text-primary bg-primary/10 flex h-9 w-fit items-center rounded-md p-1 px-4 text-sm font-medium"
							>
								<div>{currentTime}</div>
							</div>
						</div>
						<div class="flex flex-col items-start justify-start gap-1">
							<div
								class="relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md text-sm font-medium"
							>
								<Select.Trigger
									class="text-primary bg-primary/10 relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md border-none p-1 px-4 text-sm font-medium shadow-none"
								>
									<span>{paymentOptions.find((p) => p.value === paymentMethod)?.label}</span>
								</Select.Trigger>

								<Select.Content>
									<Select.Group>
										{#each paymentOptions as option (option.value)}
											<Select.Item value={option.value}>{option.label}</Select.Item>
										{/each}
									</Select.Group>
								</Select.Content>
							</div>
						</div>
					</div>
					<div class="grid w-full flex-1 grid-cols-5 flex-row items-end justify-center gap-5">
						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Customer Name</div>
							<div class="h-auto w-full rounded-lg border border-gray-200 p-1">
								<Input
									placeholder="Customer Name"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>

						<!-- Phone Number -->
						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Phone Number</div>
							<div class="h-auto w-full rounded-lg border border-gray-200 p-1">
								<Input
									type="tel"
									placeholder="Phone Number"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>

						<!-- Search Product -->
						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Search Product</div>
							<div class="h-auto w-full rounded-lg border border-gray-200 p-1">
								<Input
									placeholder="Search Product"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>
						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Amount Received</div>
							<div class="h-auto w-full rounded-lg border border-gray-200 p-1">
								<Input
									placeholder="Amount Received"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>

						{@render searchButton()}
					</div>
				</Card.Content>
			</Card.Root>
		</section>
	</Select.Root>
{/if}

<style>
	:global {
		input:focus {
			outline: none !important;
			box-shadow: none !important;
		}
	}
</style>
