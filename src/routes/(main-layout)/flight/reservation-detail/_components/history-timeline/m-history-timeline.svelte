<script lang="ts">
	import { Close, History } from '$lib/components/icons';
	import * as Card from '$lib/components/ui/card/';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { ChevronRight } from '@lucide/svelte';
	import HistoryTimelineItem from './history-timeline-item.svelte';
	import type { HistoryTimelineProps } from './types';

	let { histories }: Pick<HistoryTimelineProps, 'histories'> = $props();

	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger class="w-full">
		<Card.Root class="rounded-none py-0">
			<Card.Content class="p-4">
				<div class="flex items-center justify-between">
					<div class="flex items-center gap-x-2">
						<History />
						Histories
					</div>
					<ChevronRight />
				</div>
			</Card.Content>
		</Card.Root>
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="max-h-[70lvh] overflow-y-auto" data-vaul-no-drag>
			<div class="sticky top-0">
				<div class="flex items-center justify-between bg-white p-4 pt-0">
					<div class="flex items-center gap-x-2">
						<History />
						<p>Histories</p>
					</div>
					<button onclick={() => (open = false)}>
						<Close />
					</button>
				</div>
				<Separator />
			</div>

			<div class="p-4">
				{#each [...histories].reverse() as history, historyIdx}
					<HistoryTimelineItem date={history.dateTime} active={historyIdx === 0}>
						<p>{history.title}</p>
						<p
							class={cn('text-sm text-gray-500', {
								'mb-4': !!history.description
							})}
						>
							{history.actor.name} • {history.actor.companyName}
						</p>
						{#if history.description}
							<p class="whitespace-pre-wrap">{history.description}</p>
						{/if}
					</HistoryTimelineItem>
				{/each}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
