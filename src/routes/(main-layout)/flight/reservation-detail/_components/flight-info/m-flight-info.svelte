<script lang="ts">
	import { Close } from '$lib/components/icons';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { transitDisplay } from '$lib/helpers/search-flight-helper';
	import type { Flight } from '$lib/types/api/flight/booking/Booking';
	import { ChevronDown } from '@lucide/svelte';
	import { FlightInformation } from '../../../_components/flight-information';

	let { flight }: { flight: Flight } = $props();

	let isOpenDetail = $state(false);

	const hasSameMarketingCarrier = $derived.by(() => {
		const segments = flight.segments;
		const firstName = segments[0].marketingCarrier.name;
		return segments.every((segment) => segment.marketingCarrier.name === firstName);
	});
</script>

<div class="flex items-center gap-x-8 rounded-md border px-4 py-1 shadow-md">
	<div class="w-full">
		<div class="flex items-center gap-6">
			<!-- AIRLINE LOGO + NAME -->
			<div class="flex w-14 flex-col items-center gap-y-2 py-2 text-center">
				{#if hasSameMarketingCarrier}
					<img
						class="h-10 w-10 object-contain"
						src={flight.segments[0].marketingCarrier.image}
						alt="Airline Logo"
					/>
				{:else}
					<div class="relative h-14 w-14">
						<img
							src={flight.segments[0].marketingCarrier.image}
							alt="Airline Logo"
							class="absolute h-10 w-10 rounded-full border border-gray-300"
							style="z-index: 10;"
						/>
						<img
							src={flight.segments[1].marketingCarrier.image}
							alt="Airline Logo"
							class="absolute left-3 top-3 h-10 w-10 rounded-full border border-gray-300"
							style="z-index: 20;"
						/>
					</div>
				{/if}

				<p class="text-sm">
					{hasSameMarketingCarrier ? flight.segments[0].marketingCarrier.name : 'Multi Airlines'}
				</p>
			</div>

			<!-- DEPARTURE -> ARRIVAL -->
			<div class="flex flex-1 items-center gap-4">
				<!-- ORIGIN -->
				<div class=" text-center leading-none">
					<div class="text-lg font-medium">{displayTime(flight.departureDateTime)}</div>
					<div class="text-muted-foreground">{flight.origin.airport.code}</div>
				</div>

				<!-- DURATION -->
				<div class="flex w-full items-center justify-center gap-2 text-center">
					<div class="w-full border-b border-dashed border-muted-foreground"></div>
					<div class="text-sm">
						<div class="whitespace-nowrap">{formatTimeSpan(flight.travelTime)}</div>
						<div class="text-xs text-muted-foreground">
							{transitDisplay(flight.segments.length - 1)}
						</div>
					</div>

					<div class="w-full border-b border-dashed border-muted-foreground"></div>
				</div>

				<!-- DESTINATION -->
				<div class="text-center leading-none">
					<div class="text-lg font-medium">{displayTime(flight.arrivalDateTime)}</div>
					<div class="text-muted-foreground">{flight.destination.airport.code}</div>
				</div>
			</div>
		</div>
	</div>
	<Drawer.Root bind:open={isOpenDetail}>
		<Drawer.Trigger>
			<ChevronDown class="text-primary/80" />
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="max-h-[70lvh] overflow-y-auto" data-vaul-no-drag>
				<div class="sticky top-0">
					<div class="flex items-center justify-between bg-white p-4 pt-1">
						<div>
							<p>Flight Detail</p>
						</div>
						<button onclick={() => (isOpenDetail = false)}>
							<Close />
						</button>
					</div>
					<Separator />
				</div>

				<div class="space-y-4 p-4">
					<FlightInformation segments={flight.segments} />
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
</div>
