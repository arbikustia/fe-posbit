<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';

	let { variant = 'default' }: any = $props();

	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { type DateValue, DateFormatter, getLocalTimeZone } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Icon from '@iconify/svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { LoaderCircle } from '@lucide/svelte';
	import { goto } from '$app/navigation';
	import * as Select from '$lib/components/ui/select/index.js';
	import dayjs from 'dayjs';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $state<DateValue>();
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
	<section class="bg-card sticky top-0 z-31 border-y shadow-sm">
		<div class="mx-auto max-w-6xl space-y-2 px-4 pt-2 pb-2">
			<div class="flex w-full flex-1 grid-cols-5 flex-row items-end justify-start gap-5">
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 h-auto w-fit rounded-md p-1 px-4 text-sm font-medium"
						>
							<div>{dayjs().format('DD-MM-YYYY')}</div>
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md p-1 px-4 text-sm font-medium"
						>
							<Select.Root type="single">
								<div class="">Cash</div>
								<Select.Content>
									<Select.Item value="light">Debit</Select.Item>
									<Select.Item value="dark">Cash</Select.Item>
								</Select.Content>
							</Select.Root>
							<Icon icon="octicon:chevron-down-16" width="16" height="16" />
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
	<section class="w-full">
		<Card.Root>
			<Card.Content class="flex w-full flex-col items-start space-y-2">
				<div class="flex w-full flex-1 grid-cols-5 flex-row items-end justify-start gap-5">
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 h-auto w-fit rounded-md p-1 px-4 text-sm font-medium"
						>
							<div>{dayjs().format('DD-MM-YYYY')}</div>
						</div>
					</div>
					<div class="flex flex-col items-start justify-start gap-1">
						<div
							class="text-primary bg-primary/10 flex h-auto w-fit cursor-pointer items-center space-x-2 rounded-md p-1 px-4 text-sm font-medium"
						>
							<Select.Root type="single">
								<div class="">Cash</div>
								<Select.Content>
									<Select.Item value="light">Debit</Select.Item>
									<Select.Item value="dark">Cash</Select.Item>
								</Select.Content>
							</Select.Root>
							<Icon icon="octicon:chevron-down-16" width="16" height="16" />
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
{/if}

<style>
	:global {
		input:focus {
			outline: none !important;
			box-shadow: none !important;
		}
	}
</style>
