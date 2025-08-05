<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Tabs from '$lib/components/ui/tabs';
	import { fly } from 'svelte/transition';
	import type { TripDetailDialogProps, TabKey } from './types';
	import { tabs } from './constants';
	import { TripTimeline } from '../trip-timeline';
	import { TripRouteInfo } from '../trip-route-info';

	let { isOpen = $bindable() }: TripDetailDialogProps = $props();

	let activeTab: TabKey = $state('detail');
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="p-0">
		<Dialog.Header class="rounded-lg px-4 pt-4">
			<Dialog.Title class="flex items-center gap-x-2">
				<TripRouteInfo
					origin="Gambir"
					destination="Bandung"
					originCode="GMR"
					destinationCode="BDG"
				/>
			</Dialog.Title>
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
				<Tabs.Content
					class="custom-scrollbar mt-0 max-h-96 overflow-x-hidden p-4"
					value={tab.value}
				>
					{#if activeTab === 'detail'}
						<div in:fly={{ x: -500, duration: 500 }} class="flex items-center justify-center">
							<TripTimeline />
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
					{#if activeTab === 'information'}
						<div class="rounded-md border bg-white p-2" in:fly={{ x: 500, duration: 500 }}>
							<div class="space-y-2 text-sm">
								<p class="text-base font-semibold">Important Information</p>
								<div>
									<p class="text-base font-semibold">Check-In</p>
									<ul class="list-disc pl-7">
										<li>
											Boarding passes can be printed at self-service machines at all stations 7 days
											before the train's departure time.
										</li>

										<li>
											For check-in within 24 hours of the train's departure, boarding pass can only
											be printed at the departure station.
										</li>
										<li>
											Passengers can get an electronic boarding pass through this application
											starting 2 hours before the train's scheduled departure.
										</li>
									</ul>
								</div>
								<div>
									<p class="text-base font-semibold">Passenger</p>
									<ul class="list-disc pl-7">
										<li>
											Pregnant women who rides a long-distance train must meet the following
											criteria:
											<ol class="list-inside list-[lower-alpha] pl-5">
												<li>Pregnancy age between 14 and 28 weeks</li>
												<li>In good health</li>
												<li>No complications during pregnancy</li>
												<li>Accompanied by at least one adult passenger</li>
											</ol>
										</li>
										<li>
											Passengers 3 years old and older are considered adults, hence subject to adult
											fares, and will be assigned seats based on their tickets.
										</li>
										<li>
											Passengers under 3 years old are considered Infants and will not be charged a
											ticket fare if they do not take their own seat.
										</li>
										<li>
											Infant passengers will be charged a ticket fare if they take their own seat.
										</li>
									</ul>
								</div>
							</div>
						</div>
					{/if}
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	</Dialog.Content>
</Dialog.Root>
