<script lang="ts">
	import { Reset } from '$lib/components/icons';
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { displayDate, displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { transitDisplay } from '$lib/helpers/search-flight-helper';
	import type { Trip } from '$lib/types/FlightResponse';
	import { cn } from '$lib/utils';
	import { ArrowLeft } from '@lucide/svelte';
	import { getPassengerFullName } from '../page/helpers';
	import { useAddBaggageDialog } from './add-baggage-dialog.svelte.js';
	import type { AddBaggageDialogProps } from './types';
	import { ancillaryIconUrl } from '$lib/constants/app';

	let { form, open = $bindable(), trips }: AddBaggageDialogProps & { trips: Trip[] } = $props();

	const { form: formData } = form;

	const {
		state,
		handleFlightSelection,
		selectBaggage,
		getSelectedBaggageForTrip,
		calculateTripBaggageTotal,
		calculateTotalPrice,
		resetBaggageSelection
	} = useAddBaggageDialog(formData);

	const passengers = $derived.by(() => {
		return $formData.passengers.filter((item) => item.ageGroup !== 'infant');
	});
</script>

<Drawer.Root bind:open>
	<Drawer.Content
		class="border-none p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="static max-w-full bg-primary/85 text-primary-foreground">
			{#snippet leftAction()}
				<button
					onclick={() => {
						open = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="flex items-center gap-x-4 text-lg font-semibold">
					<img class="h-6" src={ancillaryIconUrl.baggage} alt="Baggage Icon" />
					Baggage
				</div>
			{/snippet}

			{#snippet rightContent()}
				<button onclick={resetBaggageSelection}>
					<Reset />
				</button>
			{/snippet}
		</MOSGAppBar>

		<div class="h-full space-y-4 overflow-y-auto bg-gray-100 pb-24 pt-4">
			{#each state.availableBaggageOptions as baggageOption}
				{@const trip = trips[baggageOption.TripIndex]}
				{@const departureDate = displayDate(trip.departureDateTime, 'DD MMM YYYY')}
				{@const isAvailable = true}
				<div class="space-y-2">
					<div class="px-4">
						{#if state.availableBaggageOptions.length > 2}
							Flight {baggageOption.TripIndex + 1}: {departureDate}
						{:else}
							{baggageOption.TripIndex === 0 ? 'Departure' : 'Return'}: {departureDate}
						{/if}
					</div>

					<div class="bg-card py-2 shadow-sm">
						<div class="flex items-center justify-between px-4">
							<div class="space-y-1">
								<div class="flex items-center gap-4">
									<div class="rounded-full border border-gray-400 p-2">
										<img
											class="h-5 w-5 object-contain"
											src={trip.platingCarrier.image}
											alt="Airplane Logo"
										/>
									</div>
									<div>
										<p class="font-semibold">
											{trip.origin.airport.code} → {trip.destination.airport.code}
										</p>
										<p class="text-sm text-gray-500">
											{displayTime(trip.departureDateTime)} - {displayTime(trip.arrivalDateTime)}
											∙ {formatTimeSpan(trip.travelTime)} ∙ {transitDisplay(trip.transitCount)}
										</p>
									</div>
								</div>
							</div>
							<p class="text-sm text-green-500">Free Baggage 20kg</p>
						</div>
						<Separator class="my-2" />
						<div>
							{#if isAvailable}
								<div class="space-y-2">
									{#each passengers as passenger, passengerIndex}
										{@const isLast = passengerIndex === passengers.length - 1}
										{@const selectedBaggage = $formData.ancillary.baggages.find(
											(item) =>
												item.tripIndex === baggageOption.TripIndex &&
												item.passengerIdx === passengerIndex
										)}

										<div class="space-y-2">
											<div class="flex items-center justify-between px-4">
												<p>
													{passengerIndex + 1}. {getPassengerFullName(passenger)}
												</p>
												{#if selectedBaggage}
													<p class="text-sm">Total {selectedBaggage.baggageName}</p>
												{/if}
											</div>

											<div
												class="scrollbar-hide flex items-center gap-x-2 overflow-x-auto p-2 px-4"
											>
												{#each baggageOption.Items as baggageItem}
													{@const isSelected = $formData.ancillary.baggages.find(
														(item) =>
															item.passengerIdx === passengerIndex &&
															item.tripIndex === baggageOption.TripIndex &&
															item.baggageId === baggageItem.Code
													)}
													<button
														class={cn(
															'min-w-28 cursor-pointer space-y-1 rounded-md border border-gray-300 py-2 text-center text-sm',
															{ 'ring-2 ring-primary': isSelected }
														)}
														onclick={() =>
															selectBaggage(passengerIndex, baggageItem, baggageOption.TripIndex)}
													>
														<p class="font-semibold">+{baggageItem.Quantity}</p>
														<p class="text-primary">
															{baggageItem.CurrencyCode}
															{formatThousand(baggageItem.Amount)}
														</p>
													</button>
												{/each}
											</div>
										</div>

										{#if !isLast}
											<div class="px-4">
												<OSGDashSeparator class="border-gray-300" />
											</div>
										{/if}
									{/each}
								</div>
							{:else}
								<div class="py-4">
									<p class="text-center text-sm text-gray-500">
										Baggage selection not available for this flight
									</p>
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			<div>
				<button class="flex items-center gap-x-1">
					<p class="text-sm"><span class="font-semibold">Subtotal</span> (Baggage)</p>
				</button>
				<p class="font-semibold">
					{calculateTotalPrice()}
				</p>
			</div>
			<Button class="px-8" onclick={() => (open = false)}>Done</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
