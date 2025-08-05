<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
	import { FlightInformation } from '../flight-information';
	import type { FlightDetailDialogProps, TabKey } from './types';
	import { tabs } from './constants';

	let { isOpen = $bindable(), trip, classId, flightNumber }: FlightDetailDialogProps = $props();

	let activeTab: TabKey = $state('detail');
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="p-0">
		<Dialog.Header class="rounded-lg px-4 pt-4">
			<Dialog.Title class="flex items-center gap-x-2"
				>{flightNumber ? `Flight ${flightNumber}: ` : ''}{trip.origin.city.name} ({trip.origin
					.airport.code})
				<span><Icon icon="mdi-light:arrow-right" /></span>
				{trip.destination.city.name} ({trip.destination.airport.code})</Dialog.Title
			>
		</Dialog.Header>

		<Tabs.Root bind:value={activeTab} class="rounded-lg bg-gray-100">
			<Tabs.List class="w-full justify-start gap-x-4 rounded-none bg-white px-4">
				{#each tabs as tab}
					<Tabs.Trigger
						class="rounded-none border-b-2 border-b-transparent px-0 focus-visible:ring-0 data-[state=active]:border-b-primary data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
						value={tab.value}>{tab.label}</Tabs.Trigger
					>
				{/each}
			</Tabs.List>

			{#each tabs as tab}
				{@const cabinClass = trip.classes.find((cls) => cls.uniqueId === classId)?.cabinClass}
				<Tabs.Content
					class="custom-scrollbar mt-0 max-h-96 overflow-x-hidden p-4"
					value={tab.value}
				>
					{#if activeTab === 'detail'}
						<div in:fly={{ x: -500, duration: 500 }}>
							<FlightInformation segments={trip.segments} {cabinClass} />
						</div>
					{/if}
					{#if activeTab === 'fare-rules'}
						<div class="rounded-md border bg-white p-2" in:fly={{ x: 500, duration: 500 }}>
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
							has been the industry's standard dummy text ever since the 1500s, when an unknown
							printer took a galley of type and scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap into electronic typesetting,
							remaining essentially unchanged. It was popularised in the 1960s with the release of
							Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
							publishing software like Aldus PageMaker including versions of Lorem IpsumLorem Ipsum
							is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
							the industry's standard dummy text ever since the 1500s, when an unknown printer took
							a galley of type and scrambled it to make a type specimen book. It has survived not
							only five centuries, but also the leap into electronic typesetting, remaining
							essentially unchanged. It was popularised in the 1960s with the release of Letraset
							sheets containing Lorem Ipsum passages, and more recently with desktop publishing
							software like Aldus PageMaker including versions of Lorem Ipsum
						</div>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
