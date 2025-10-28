<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import dayjs from 'dayjs';
	import { onMount, onDestroy } from 'svelte';
	import { useTransactionForm } from './form.svelte';
	import { browser } from '$app/environment';

	const { state } = useTransactionForm();
	// Variant prop
	let { variant = 'default' }: any = $props();
	let timer: NodeJS.Timeout | null = null;

	function getCookie(name: string) {
		if (!browser) return null;
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop()?.split(';').shift();
		return null;
	}

	onMount(() => {
		state.username = getCookie('username') || 'superadmin';
		timer = setInterval(() => {
			state.currentTime = dayjs().format('DD-MM-YYYY HH:mm:ss');
		}, 1000);
	});
	onDestroy(() => timer && clearInterval(timer));

	const paymentOptions = [
		{ value: 'CASH', label: 'CASH' },
		{ value: 'DEBIT', label: 'DEBIT' }
	];

	// Fungsi ketika klik Purchase
	function handlePurchase() {
		console.log('Data Transaksi:', {
			...state,
			time: state.currentTime
		});

		// Contoh tindakan lanjut:
		// - Validasi form
		// - Kirim ke API
		// - Navigasi ke halaman lain
		goto('/invoice');
	}
</script>

<!-- ==== VARIANT STICKY ==== -->
{#if variant === 'sticky'}
	<Select.Root type="single" bind:value={state.paymentMethod} bind:open={state.paymentMethodeOpen}>
		<section class="bg-card sticky top-0 z-31 border-y shadow-sm">
			<div class="mx-auto max-w-6xl space-y-2 px-4 pt-2 pb-2">
				<div class="flex w-full flex-1 grid-cols-5 flex-row items-end justify-start gap-5">
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 flex h-9 w-fit items-center gap-2 rounded-md p-1 px-4 text-sm font-medium"
						>
							<Icon icon="solar:user-linear" width="14" height="14" class="text-primary" />
							{state.username}
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 flex h-9 w-fit items-center rounded-md p-1 px-4 text-sm font-medium"
						>
							<div>{state.currentTime}</div>
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md text-sm font-medium"
						>
							<Select.Trigger
								class="text-primary bg-primary/10 relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md border-none p-1 px-4 text-sm font-medium shadow-none"
							>
								<span>{paymentOptions.find((p) => p.value === state.paymentMethod)?.label}</span>
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

				<!-- FORM INPUT -->
				<div class="grid w-full grid-cols-6 flex-row items-end justify-start gap-2">
					<div class="flex flex-col items-start justify-start gap-1">
						<Input
							type="tel"
							bind:value={state.customerNumber}
							placeholder="Phone Number"
							class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
						/>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<Input
							bind:value={state.customerName}
							placeholder="Customer Name"
							class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
						/>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<Input
							bind:value={state.searchProduct}
							placeholder="Search Product"
							class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
						/>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<Input
							type="number"
							bind:value={state.amount}
							placeholder="Amount Received"
							class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
						/>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<Input
							type="number"
							bind:value={state.discount}
							placeholder="Discount (%)"
							class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
						/>
					</div>

					<!-- BUTTON -->
					<Button
						onclick={handlePurchase}
						class={cn('h-10 w-full flex-none text-lg', {})}
						size="lg"
					>
						<span class="ml-1">Purchase</span>
					</Button>
				</div>
			</div>
		</section>
	</Select.Root>

	<!-- ==== VARIANT DEFAULT ==== -->
{:else}
	<Select.Root type="single" bind:value={state.paymentMethod} bind:open={state.paymentMethodeOpen}>
		<section class="w-full">
			<Card.Root>
				<Card.Content class="flex w-full flex-col items-start space-y-2">
					<div class="flex w-full flex-1 grid-cols-5 flex-row items-end justify-start gap-5">
						<div class="flex flex-col items-start justify-start gap-1">
							<div
								class="text-primary bg-primary/10 flex h-9 w-fit items-center gap-2 rounded-md p-1 px-4 text-sm font-medium"
							>
								<Icon icon="solar:user-linear" width="14" height="14" class="text-primary" />
								{state.username}
							</div>
						</div>
						<div class="flex w-48 flex-col items-start justify-center gap-1">
							<div
								class="text-primary bg-primary/10 flex h-9 w-full items-center justify-center rounded-md p-1 px-4 text-center text-sm font-medium"
							>
								{state.currentTime}
							</div>
						</div>
						<div class="flex flex-col items-start justify-start gap-1">
							<Select.Trigger
								class="text-primary bg-primary/10 relative flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md border-none p-1 px-4 text-sm font-medium shadow-none"
							>
								<span>{paymentOptions.find((p) => p.value === state.paymentMethod)?.label}</span>
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

					<!-- FORM INPUT -->
					<div class="grid w-full flex-1 grid-cols-6 flex-row items-end justify-center gap-5">
						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Phone Number</div>
							<div class=" rounded-lg border border-gray-300 p-1">
								<Input
									type="tel"
									bind:value={state.customerNumber}
									placeholder="Phone Number"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>

						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Customer Name</div>
							<div class=" rounded-lg border border-gray-300 p-1">
								<Input
									bind:value={state.customerName}
									placeholder="Customer Name"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>

						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Amount Received</div>
							<div class=" rounded-lg border border-gray-300 p-1">
								<Input
									type="number"
									bind:value={state.amount}
									placeholder="Amount Received"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>

						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Discount (%)</div>
							<div class=" rounded-lg border border-gray-300 p-1">
								<Input
									type="number"
									bind:value={state.discount}
									placeholder="Discount (%)"
									class="hover:bg-primary/5 h-10 w-full border-none  px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>
						<div class="flex flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Scan Item</div>
							<div class=" rounded-lg border border-gray-300 p-1">
								<Input
									bind:value={state.searchTerm}
									placeholder="Scan Item"
									class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm shadow-none transition outline-none"
								/>
							</div>
						</div>

						<Button
							onclick={handlePurchase}
							class={cn('h-12 w-full flex-none text-lg', { 'min-h-11': variant === 'default' })}
							size="lg"
						>
							<span class="ml-1">Purchase</span>
						</Button>
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
