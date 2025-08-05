<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import { ancillaryIconUrl } from '$lib/constants/app';
	import { getPassengerFullName } from '../page/helpers';
	import { useAddBaggageDialog } from './add-baggage-dialog.svelte.js';
	import AddBaggageFlightSelection from './add-baggage-flight-selection.svelte';
	import type { AddBaggageDialogProps } from './types';

	let { form, open = $bindable() }: AddBaggageDialogProps = $props();

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
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-0 p-0 lg:max-w-6xl">
		<div class="grid min-h-[50vh] grid-cols-12 rounded-md bg-gray-100">
			{#if state.availableBaggageOptions.length > 0}
				<div class="col-span-4 rounded-tl-md border-r bg-white">
					<div class="flex items-center gap-x-4 p-4 text-lg font-semibold">
						<img class="h-6" src={ancillaryIconUrl.baggage} alt="Baggage Icon" />
						Baggage
					</div>
					<Separator />

					{#each state.availableBaggageOptions as baggage}
						{@const selectedBaggages = getSelectedBaggageForTrip(baggage.TripIndex)}
						{@const tripTotalPrice = calculateTripBaggageTotal(baggage.TripIndex)}
						{@const isAvailable = true}
						<AddBaggageFlightSelection
							isSelected={baggage.TripIndex === state.selectedTripIndex}
							tripIdx={baggage.TripIndex}
							onSelect={handleFlightSelection}
							{selectedBaggages}
							totalPrice={tripTotalPrice}
							isUnavailable={!isAvailable}
						/>
					{/each}
				</div>

				<div class="col-span-8 space-y-4 p-4">
					<p class="font-semibold">
						Select Baggage for <span class="uppercase"
							>{state.availableBaggageOptions[state.selectedTripIndex].Origin} - {state
								.availableBaggageOptions[state.selectedTripIndex].Destination}</span
						>
					</p>
					<div class="space-y-2">
						{#each $formData.passengers.filter((item) => item.ageGroup !== 'infant') as passenger, passengerIndex}
							<div class="space-y-2">
								<p>
									{passengerIndex + 1}. {getPassengerFullName(passenger)}
								</p>

								<div class="grid auto-cols-fr grid-flow-col gap-x-2">
									{#each state.availableBaggageOptions[state.selectedTripIndex].Items as baggageItem}
										{@const isSelected = $formData.ancillary.baggages.find(
											(item) =>
												item.passengerIdx === passengerIndex &&
												item.tripIndex === state.selectedTripIndex &&
												item.baggageId === baggageItem.Code
										)}
										<button
											class={cn(
												'cursor-pointer space-y-1 rounded-md border border-gray-300 py-2 text-center text-sm',
												{ 'ring-primary ring-2': isSelected }
											)}
											onclick={() => selectBaggage(passengerIndex, baggageItem)}
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
						{/each}
					</div>
				</div>
			{/if}
		</div>

		<Dialog.Footer class="grid grid-cols-12 border-t p-4 shadow-md">
			<div class="col-span-4">
				<div class="flex justify-between text-lg font-semibold">
					<p>Subtotal</p>
					<p class="text-primary">{calculateTotalPrice()}</p>
				</div>
				<div class="text-sm text-gray-500">(All flight and pax)</div>
			</div>
			<div class="col-span-8 flex items-center justify-end gap-x-2">
				<Button variant="ghost" onclick={() => resetBaggageSelection()}>Reset</Button>
				<Button
					onclick={() => {
						open = false;
					}}>Done</Button
				>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
