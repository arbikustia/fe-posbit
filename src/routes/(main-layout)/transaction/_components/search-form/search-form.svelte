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

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value = $state<DateValue>();
</script>

{#if variant === 'sticky'}
	{#snippet searchButton()}
		<Button class={cn('h-10 w-[120px] flex-none text-lg', {})} size="lg">
			<span class="ml-1">Purchase</span>
		</Button>
	{/snippet}
	<section class="bg-card sticky top-0 z-31 border-y shadow-sm">
		<div class="mx-auto max-w-6xl space-y-4 px-4 pt-2 pb-2">
			<div class="flex items-start justify-start gap-2">
				<div class="bg-primary/10 text-primary flex items-center gap-1 px-2 text-sm rounded-md font-medium">
					<Icon icon="solar:user-linear" width="14" height="14" class="text-primary" />
					superadmin
				</div>
			</div>
			<div class="flex w-full flex-row items-end justify-start gap-2">
				<Popover.Root>
					<div class="flex w-[20%] flex-col items-start justify-start gap-1">
						<div class="h-auto w-full rounded-lg border border-gray-200">
							<Popover.Trigger class="flex h-10 w-full items-center  justify-start border-none">
								{#snippet child({ props })}
									<Button
										variant="outline"
										disabled
										class={cn(
											'w-full justify-start text-left text-sm font-normal',
											!value && 'text-muted-foreground'
										)}
										{...props}
									>
										<CalendarIcon class="mr-2 size-4" />
										{value ? df.format(value.toDate(getLocalTimeZone())) : '05/10/2025'}
									</Button>
								{/snippet}
							</Popover.Trigger>
						</div>
					</div>
					<Popover.Content class="w-auto p-0">
						<Calendar bind:value type="single" initialFocus />
					</Popover.Content>
				</Popover.Root>
				<div class="flex w-[20%] flex-col items-start justify-start gap-1">
					<div class="h-auto w-full rounded-lg border border-gray-200">
						<Input
							placeholder="Customer Name"
							class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
						/>
					</div>
				</div>
				<div class="flex w-[20%] flex-col items-start justify-start gap-1">
					<div class="h-auto w-full rounded-lg border border-gray-200">
						<Input
							placeholder="Search Product"
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
			class={cn('h-[46px] w-[120px] flex-none text-lg', {
				'min-h-11': variant === 'default'
			})}
			size="lg"
		>
			<span class="ml-1">Purchase</span>
		</Button>
	{/snippet}
	<section class="w-full">
		<Card.Root>
			<Card.Content class="flex w-full flex-col items-start ">
				<div class="bg-primary/10 mb-3 flex items-center gap-2 rounded-lg px-3 py-1 text-start">
					<div class="text-primary flex items-center gap-1 text-sm font-medium">
						<Icon icon="solar:user-linear" width="14" height="14" class="text-primary" />
						superadmin
					</div>
				</div>

				<div class="flex w-full flex-1 flex-row items-end justify-start gap-5">
					<Popover.Root>
						<div class="flex w-[20%] flex-col items-start justify-start gap-1">
							<div class="text-sm font-medium text-gray-500">Date</div>
							<div class="h-auto w-full rounded-lg border border-gray-200 p-1">
								<Popover.Trigger class="flex h-10 w-full items-center  justify-start border-none">
									{#snippet child({ props })}
										<Button
											variant="outline"
											disabled
											class={cn(
												'w-full justify-start text-left text-sm font-normal',
												!value && 'text-muted-foreground'
											)}
											{...props}
										>
											<CalendarIcon class="mr-2 size-4" />
											{value ? df.format(value.toDate(getLocalTimeZone())) : '05/10/2025'}
										</Button>
									{/snippet}
								</Popover.Trigger>
							</div>
						</div>
						<Popover.Content class="w-auto p-0">
							<Calendar bind:value type="single" initialFocus />
						</Popover.Content>
					</Popover.Root>

					<div class="flex w-[20%] flex-col items-start justify-start gap-1">
						<div class="text-sm font-medium text-gray-500">Customer Name</div>
						<div class="h-auto w-full rounded-lg border border-gray-200 p-1">
							<Input
								placeholder="Customer Name"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
							/>
						</div>
					</div>
					<div class="flex w-[20%] flex-col items-start justify-start gap-1">
						<div class="text-sm font-medium text-gray-500">Search Product</div>
						<div class="h-auto w-full rounded-lg border border-gray-200 p-1">
							<Input
								placeholder="Search Product"
								class="hover:bg-primary/5 h-10 w-full rounded-md border-none px-3 py-2 text-sm transition outline-none"
							/>
						</div>
					</div>

					{@render searchButton()}
				</div>
			</Card.Content>
		</Card.Root>
	</section>
{/if}
