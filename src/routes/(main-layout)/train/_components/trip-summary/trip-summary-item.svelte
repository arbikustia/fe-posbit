<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { OSGActiveSelectionIndicator } from '$lib/components/opsigo-ui/active-selection-indicator';
	import TripSummaryCard from './trip-summary-card.svelte';
	import TripSummarySegmentLabel from './trip-summary-segment-label.svelte';
	import { TripDetailDialog } from '../trip-detail-dialog';

	type TripSummaryItem = {
		idx: number;
		onChange?: (idx: number) => void;
		isActive?: boolean;
		isMultiFlight?: boolean;
		selected?: boolean;
	};

	let isDetailDialogOpen = $state(false);

	let {
		onChange,
		idx,
		isActive = false,
		isMultiFlight = false,
		selected = false
	}: TripSummaryItem = $props();

	function handleOpenDetail() {
		isDetailDialogOpen = true;
	}
</script>

{#snippet placeholder()}
	<div
		class="flex min-h-[72px] w-full items-center justify-center rounded-xl border-2 border-dashed p-3"
	>
		<div class="flex items-center gap-x-2 text-muted-foreground">
			<div class="text-right">
				<p>GMR</p>
				<p class="text-sm">Gambir</p>
			</div>
			<ArrowRight />
			<div class="text-left">
				<p>BD</p>
				<p class="text-sm">Bandung</p>
			</div>
		</div>
	</div>
{/snippet}

{#snippet flightInfo()}
	<TripSummaryCard />
{/snippet}

<div>
	<div class="relative px-4">
		<div class="mb-4">
			<TripSummarySegmentLabel
				label={idx + 1}
				{isActive}
				showDetailAction={selected}
				onDetailActionClick={handleOpenDetail}
			/>
		</div>

		{#if selected}
			{@render flightInfo()}
		{:else}
			{@render placeholder()}
		{/if}

		<OSGActiveSelectionIndicator {isActive} />
	</div>

	{#if selected && isMultiFlight && !isActive}
		<div class="px-4">
			<Button
				class="mt-2 w-full text-primary hover:text-primary"
				variant="outline"
				size="sm"
				onclick={() => onChange?.(idx)}
			>
				Change Departure Schedule
			</Button>
		</div>
	{/if}
</div>

<TripDetailDialog bind:isOpen={isDetailDialogOpen} />
