<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Tabs from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';
	import { fly } from 'svelte/transition';
	import { FlightInformation } from '../flight-information';
	import type { FlightDetailDialogProps, TabKey } from './types';
	import { tabs } from './constants';
	import { Close } from '$lib/components/icons';
	import type { DrawerRootProps } from 'vaul-svelte';

	let {
		isOpen = $bindable(),
		trip,
		classId,
		additionalContent
	}: FlightDetailDialogProps = $props();

	let activeTab: TabKey = $state('detail');
</script>

<Drawer.Root bind:open={isOpen}>
	<Drawer.Content
		class="border-none p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<Drawer.Header
			class="bg-primary/85 text-primary-foreground flex flex-row items-center gap-x-4 rounded-none border-b px-4 pt-4"
		>
			<button
				onclick={() => {
					isOpen = false;
				}}
			>
				<Close />
			</button>
			<Drawer.Title class="text-primary-foreground flex items-center gap-x-2"
				>{trip.origin.city.name} ({trip.origin.airport.code})
				<span><Icon icon="mdi-light:arrow-right" /></span>
				{trip.destination.city.name} ({trip.destination.airport.code})</Drawer.Title
			>
		</Drawer.Header>

		<Tabs.Root bind:value={activeTab} class="h-full rounded-lg bg-gray-100">
			<Tabs.List class="h-fit w-full gap-x-4 rounded-none bg-white p-0">
				{#each tabs as tab}
					<Tabs.Trigger
						class="data-[state=active]:border-b-primary data-[state=active]:text-primary w-full rounded-none border-b-2 border-b-transparent px-0 py-2 focus-visible:ring-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
						value={tab.value}>{tab.label}</Tabs.Trigger
					>
				{/each}
			</Tabs.List>

			{#each tabs as tab}
				<Tabs.Content
					class="custom-scrollbar mt-0 h-lvh overflow-x-hidden p-4 pb-52"
					value={tab.value}
				>
					{#if activeTab === 'detail'}
						{@const cabinClass = trip.classes.find((cls) => cls.uniqueId === classId)?.cabinClass}
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

		{@render additionalContent?.()}
	</Drawer.Content>
</Drawer.Root>
