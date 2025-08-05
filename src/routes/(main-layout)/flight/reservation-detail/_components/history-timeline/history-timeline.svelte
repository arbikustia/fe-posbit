<script lang="ts">
	import { History } from '$lib/components/icons';
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import * as Card from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import { slide } from 'svelte/transition';
	import HistoryTimelineItem from './history-timeline-item.svelte';
	import { cn } from '$lib/utils';
	import type { HistoryTimelineProps } from './types';

	let { status, histories }: HistoryTimelineProps = $props();
	let showDetail = $state(false);
</script>

<Card.Root class="gap-0 border-2 py-0" style="border-color: {bookingStatusColor[status]};">
	<Card.Header class="pb-0! border-b p-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2 font-semibold">
				<History class="h-6 w-6" />
				Histories
			</div>
			<div class="flex items-center gap-2">
				<div class="text-xs">Show Details</div>
				<Switch bind:checked={showDetail} />
			</div>
		</div>
	</Card.Header>
	<Card.Content class="p-2">
		{#each [...histories].reverse() as history, historyIdx}
			<HistoryTimelineItem date={history.dateTime} active={historyIdx === 0}>
				<p>{history.title}</p>
				<p
					class={cn('text-sm text-gray-500', {
						'mb-4': showDetail
					})}
				>
					{history.actor.name} • {history.actor.companyName}
				</p>
				{#if showDetail}
					<p class="whitespace-pre-wrap" transition:slide>{history.description}</p>
				{/if}
			</HistoryTimelineItem>
		{/each}
	</Card.Content>
</Card.Root>
