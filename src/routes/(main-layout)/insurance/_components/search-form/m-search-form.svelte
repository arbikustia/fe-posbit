<script lang="ts">
	import MMicroInsurance from './_components/micro-insurance/m-micro-insurance.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { LoaderCircle } from '@lucide/svelte';
	import { useSearchForm } from './search-form.svelte.js';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import MTravelInsurance from './_components/travel-insurance/m-travel-insurance.svelte';

	let {
		variant = 'default',
		isOpen = $bindable()
	}: { variant?: 'default' | 'drawer'; isOpen?: boolean } = $props();

	const { state, submitSearch } = useSearchForm();

	const typeOptions = [
		{ label: 'Travel Insurance', value: 'travel-insurance' },
		{ label: 'Micro Insurance', value: 'micro-insurance' }
	];

	// scroll into invalid form
	$effect(() => {
		const { isInvalidCompany, isInvalidRoute } = state.validation;
		if (isInvalidCompany || isInvalidRoute) {
			if (typeof document !== undefined) {
				document?.querySelector('.validation-alert')?.scrollIntoView({
					block: 'center',
					behavior: 'smooth'
				});
			}
		}
	});
</script>

{#snippet searchForm()}
	<div class="mt-2 mb-6 px-1">
		<ToggleGroup.Root
			bind:value={
				() => state.searchModel.insuranceType,
				(newValue) => {
					if (newValue !== '') {
						return (state.searchModel.insuranceType = newValue);
					}
				}
			}
			variant="outline"
			type="single"
			class="eq-toggle-root gap-2 shadow-none!"
			loop={false}
		>
			{#each typeOptions as typeOption}
				<ToggleGroup.Item
					value={typeOption.value}
					aria-label={`Toggle ${typeOption.label}`}
					class="eq-toggle-item bg-card! rounded-full! border-l! shadow-xs data-[state=on]:before:rounded-full!"
				>
					{typeOption.label}
				</ToggleGroup.Item>
			{/each}
		</ToggleGroup.Root>
	</div>

	<Card.Root class="mb-5 py-0">
		<Card.Content class="space-y-6 p-2 py-6">
			{#if state.searchModel.insuranceType === 'travel-insurance'}
				<MTravelInsurance bind:searchModel={state.searchModel} validation={state.validation} />
			{:else}
				<MMicroInsurance bind:searchModel={state.searchModel} validation={state.validation} />
			{/if}
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet searchButton()}
	<Button class={cn('w-full flex-none')} disabled={state.isSubmitted} onclick={submitSearch}>
		{#if state.isSubmitted}
			<LoaderCircle class="animate-spin" />
		{:else}
			<span class="ml-1">Search</span>
		{/if}
	</Button>
{/snippet}

{#if variant === 'drawer'}
	<Drawer.Root bind:open={isOpen}>
		<Drawer.Content class="h-fit p-4 pt-0 pb-2">
			<div class="overflow-y-auto pt-4">
				{@render searchForm()}

				<div>
					{@render searchButton()}
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<div class="p-2">
		{@render searchForm()}

		<div class="relative px-10">
			{@render searchButton()}
		</div>
	</div>
{/if}
