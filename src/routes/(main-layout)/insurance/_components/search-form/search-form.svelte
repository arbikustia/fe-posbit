<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { MicroInsurance } from './_components/micro-insurance/index.js';
	import { TravelInsurance } from './_components/travel-insurance/index.js';
	import { useSearchForm } from './search-form.svelte.js';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { cn } from '$lib/utils';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';

	let { variant = 'default', onSubmitCallback, isLoading }: any = $props();
	const { state, submitSearch } = useSearchForm();

	const insuranceOptions = [
		{ value: 'travel-insurance', label: 'Travel Insurance' },
		{ value: 'micro-insurance', label: 'Micro Insurance' }
	];

	$effect(() => {
		$inspect(state.searchModel, 'test');
	});

	const currentLabel = insuranceOptions.find(
		(opt) => opt.value === state.searchModel.insuranceType
	)?.label;
</script>

<Tabs.Root bind:value={state.searchModel.insuranceType}>
	{#if variant == 'sticky'}
		{#snippet travelOption()}
			<Popover.Root>
				<Popover.Trigger
					class={buttonVariants({
						variant: 'ghost',
						class: cn('text-primary hover:text-primary flex h-6 w-auto justify-between ')
					})}
					role="combobox"
				>
					<div class="flex items-center gap-2">
						<div class="text-sm font-medium">
							{state.searchModel.insuranceType}
						</div>
					</div>
					<ChevronDown class="text-muted-foreground ml-2 size-4 shrink-0" />
				</Popover.Trigger>
				<Popover.Content class="flex w-full flex-col p-2">
					{#each insuranceOptions as option}
						<Button
							variant="ghost"
							onclick={() => {
								state.searchModel.insuranceType = option.value;
							}}
							class="hover:bg-accent hover:text-accent-foreground cursor-pointer px-3 py-2 text-sm"
						>
							<div class="flex w-full items-center justify-between gap-5">
								{option.label}
								<Check
									class={cn(
										'size-4',
										state.searchModel.insuranceType !== option.value && 'opacity-0'
									)}
								/>
							</div>
						</Button>
					{/each}
				</Popover.Content>
			</Popover.Root>
		{/snippet}

		{#if state.searchModel.insuranceType === 'travel-insurance'}
			<TravelInsurance
				{travelOption}
				{state}
				{variant}
				{submitSearch}
				{onSubmitCallback}
				{isLoading}
			/>
		{:else}
			<MicroInsurance
				{travelOption}
				{state}
				{variant}
				{submitSearch}
				{onSubmitCallback}
				{isLoading}
			/>
		{/if}
	{:else if variant == 'default'}
		<Tabs.List>
			<Tabs.Trigger value="travel-insurance">Travel Insurance</Tabs.Trigger>
			<Tabs.Trigger value="micro-insurance">Micro Insurance</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="travel-insurance">
			<TravelInsurance {state} {variant} {submitSearch} {onSubmitCallback} {isLoading} />
		</Tabs.Content>
		<Tabs.Content value="micro-insurance">
			<MicroInsurance {state} {variant} {submitSearch} {onSubmitCallback} {isLoading} />
		</Tabs.Content>
	{:else if variant === 'carousel' || variant === 'combination'}
		<div class="flex w-full flex-col gap-1">
			<Tabs.List class="h-8 rounded-full">
				<Tabs.Trigger
					class="data-[state=active]:text-primary rounded-full font-bold"
					value="travel-insurance"
				>
					Travel Insurance
				</Tabs.Trigger>
				<Tabs.Trigger
					class="data-[state=active]:text-primary rounded-full font-bold"
					value="micro-insurance"
				>
					Micro Insurance
				</Tabs.Trigger>
			</Tabs.List>
		</div>
		<Tabs.Content value="travel-insurance">
			<TravelInsurance {state} {variant} {submitSearch} {onSubmitCallback} {isLoading} />
		</Tabs.Content>
		<Tabs.Content value="micro-insurance">
			<MicroInsurance {state} {variant} {submitSearch} {onSubmitCallback} {isLoading} />
		</Tabs.Content>
	{/if}
</Tabs.Root>
