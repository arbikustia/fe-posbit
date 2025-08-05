<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	// Import filter state and actions
	import {
		filterState,
		updateProviderFilter,
		updateAgeRangeFilter,
		updateAreaCoverageFilter,
		updatePriceRangeFilter,
		resetProviders,
		resetAgeRange,
		resetAreaCoverage,
		resetPriceRange,
		resetAllFilters,
		getActiveFiltersCount
	} from '../results-search/search-result.svelte';

	// Local reactive variables for UI display
	$: minAge = $filterState.ageRange[0];
	$: maxAge = $filterState.ageRange[1];
	$: minPrice = $filterState.priceRange[0];
	$: maxPrice = $filterState.priceRange[1];
	$: activeFiltersCount = getActiveFiltersCount();

	// Handle age range slider change
	function handleAgeRangeChange(value: number[]) {
		updateAgeRangeFilter([value[0], value[1]]);
	}

	// Handle price range slider change
	function handlePriceRangeChange(value: number[]) {
		updatePriceRangeFilter([value[0], value[1]]);
	}

	// Format price for display
	function formatPrice(price: number): string {
		return new Intl.NumberFormat('id-ID').format(price);
	}
</script>

<div class="w-80 space-y-4 py-4">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Icon icon="mdi:filter" width="24" height="24" style="color: #343432" />
			<h2 class="text-lg font-semibold text-gray-800">Filter</h2>
		</div>
		<Button
			variant="ghost"
			size="sm"
			onclick={resetAllFilters}
			class="text-blue-600 hover:bg-blue-50 hover:text-blue-700"
		>
			Reset All
		</Button>
	</div>

	<!-- Provider Filter -->
	<Card.Root>
		<Card.Content class="space-y-3">
			<div class="flex items-center justify-between">
				<Card.Title class="text-base font-medium">Provider</Card.Title>
				<Button
					variant="ghost"
					size="sm"
					onclick={resetProviders}
					class="text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
				>
					Reset
				</Button>
			</div>
			{#each $filterState.providers as provider}
				<div class="flex items-center space-x-2">
					<Checkbox
						id={provider.id}
						checked={provider.checked}
						onCheckedChange={(checked) => updateProviderFilter(provider.id, checked)}
					/>
					<label
						for={provider.id}
						class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						{provider.name}
					</label>
				</div>
			{/each}
		</Card.Content>

		<!-- Age Coverage Filter -->
		<Card.Content class="space-y-4">
			<div class="flex items-center justify-between">
				<Card.Title class="text-base font-medium">Age Coverage</Card.Title>
				<Button
					variant="ghost"
					size="sm"
					onclick={resetAgeRange}
					class="text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
				>
					Reset
				</Button>
			</div>
			<div class="flex items-center justify-between gap-2 text-sm text-gray-600">
				<span class="flex h-10 w-[50%] items-center justify-between rounded-md border px-2">
					<span>Min</span>
					{$filterState.ageRange[0]}
				</span>
				<span class="flex h-10 w-[50%] items-center justify-between rounded-md border px-2">
					<span>Max</span>
					{$filterState.ageRange[1]}
				</span>
			</div>

			<div class="px-1">
				<Slider
					type="multiple"
					value={$filterState.ageRange}
					onValueChange={handleAgeRangeChange}
					min={1}
					max={85}
					step={1}
					class="w-full"
				/>
			</div>
		</Card.Content>

		<!-- In your filter component -->
		<Card.Content class="space-y-3">
			<div class="flex items-center justify-between">
				<Card.Title class="text-base font-medium">Area Coverage</Card.Title>
				<Button
					variant="ghost"
					size="sm"
					onclick={resetAreaCoverage}
					class="text-xs text-blue-600 hover:bg-blue-50 hover:text-blue-700"
				>
					Reset
				</Button>
			</div>

			<!-- Worldwide option -->
			<div class="flex items-center space-x-2">
				<Checkbox
					id="worldwide"
					checked={$filterState.areaCoverage.find((a) => a.id === 'worldwide')?.checked || false}
					onCheckedChange={(checked) => updateAreaCoverageFilter('worldwide', checked)}
				/>
				<label
					for="worldwide"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Worldwide
				</label>
			</div>

			<!-- USA option -->
			<div class="flex items-center space-x-2">
				<Checkbox
					id="usa"
					checked={$filterState.areaCoverage.find((a) => a.id === 'usa')?.checked || false}
					onCheckedChange={(checked) => updateAreaCoverageFilter('usa', checked)}
				/>
				<label
					for="usa"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					USA
				</label>
			</div>

			<!-- Canada option -->
			<div class="flex items-center space-x-2">
				<Checkbox
					id="canada"
					checked={$filterState.areaCoverage.find((a) => a.id === 'canada')?.checked || false}
					onCheckedChange={(checked) => updateAreaCoverageFilter('canada', checked)}
				/>
				<label
					for="canada"
					class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
				>
					Canada
				</label>
			</div>
		</Card.Content>
	</Card.Root>
</div>
