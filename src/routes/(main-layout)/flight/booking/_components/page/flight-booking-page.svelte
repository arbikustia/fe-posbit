<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Form from '$lib/components/ui/form/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ancillaryIconUrl } from '$lib/constants/app';
	import { displayPassengerDetail } from '$lib/helpers/search-flight-helper';
	import { FareDetailCard } from '../../../_components/fare-detail-card';
	import { FlightSummary } from '../../../_components/flight-summary';
	import { AddBaggageDialog } from '../add-baggage-dialog';
	import { AddMealDialog } from '../add-meal-dialog';
	import { ContactForm } from '../contact-form';
	import {
		FlightAncillary,
		FlightAncillaryBaggageSummary,
		FlightAncillarySeatSummary,
		FlightAncillaryMealSummary
	} from '../flight-ancillary';
	import { PassengerForm } from '../passenger-form';
	import { PassengerRemarkForm } from '../passenger-remark-form';
	import { SeatSelectDialog } from '../seat-select-dialog';
	import { useFlightBookingPage } from './flight-booking-page.svelte.js';

	const { trips, state, form, formData, enhance, handleSubmit } = useFlightBookingPage();
</script>

<div class="container space-y-4">
	<h1 class="text-lg font-semibold">Passenger Detail</h1>

	<div class="relative flex items-start gap-6">
		<div class="flex-1">
			<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data">
				<div class="space-y-8">
					<div class="space-y-4">
						{#each $formData.passengers as _, i}
							<PassengerForm {form} formIdx={i} />
						{/each}
					</div>
					<div class="space-y-4">
						<div class="text-xl font-semibold">Flight Ancillary</div>
						<FlightAncillary
							title="Baggage"
							iconSrc={ancillaryIconUrl.baggage}
							actionTitle="Add Baggage"
							action={() => (state.isAddbaggageDialogOpen = true)}
						>
							{#snippet summaryContent()}
								<FlightAncillaryBaggageSummary baggages={$formData.ancillary.baggages} {trips} />
							{/snippet}
						</FlightAncillary>
						<FlightAncillary
							title="Seat"
							iconSrc={ancillaryIconUrl.seat}
							actionTitle="Pick Seat"
							action={() => (state.isSelectSeatDialogOpen = true)}
						>
							{#snippet summaryContent()}
								<FlightAncillarySeatSummary
									seats={$formData.ancillary.seats}
									passengers={$formData.passengers}
									{trips}
								/>
							{/snippet}
						</FlightAncillary>
						<FlightAncillary
							title="Meals"
							iconSrc={ancillaryIconUrl.meal}
							actionTitle="Add Meals"
							action={() => (state.isAddMealDialogOpen = true)}
						>
							{#snippet summaryContent()}
								<FlightAncillaryMealSummary
									meals={$formData.ancillary.meals}
									passengers={$formData.passengers}
									{trips}
								/>
							{/snippet}
						</FlightAncillary>
					</div>
					<div class="space-y-4">
						<div>
							<div class="text-xl font-semibold">Passenger Remark</div>
							<span class="text-sm text-gray-500">For internal use only</span>
						</div>
						<Card.Root class="py-0">
							<Card.CardContent class="space-y-4 p-4">
								{#each $formData.passengers as _, idx}
									<Form.Fieldset {form} name="passengers[{idx}].remarks">
										<PassengerRemarkForm {form} parentIdx={idx} />
									</Form.Fieldset>
									{#if idx !== $formData.passengers.length - 1}
										<Separator />
									{/if}
								{/each}
							</Card.CardContent>
						</Card.Root>
					</div>
					<div class="space-y-4">
						<div class="text-xl font-semibold">Booking Contact</div>
						<ContactForm {form} />
					</div>
				</div>
				<div class="mt-6 text-right">
					<Form.Button size="lg" class="float-right">Book Now</Form.Button>
				</div>
			</form>
		</div>

		<!-- Kolom kedua-->
		<div class="sticky top-0 w-[350px]">
			<FlightSummary
				{trips}
				flightClasses={trips.map((item) => item.classes[0])}
				paxNumber={displayPassengerDetail({ adult: 1, child: 1, infant: 1 })}
				company="RSP (Reka Sinergi Pratama)"
			/>
			<div class="mt-6"></div>
			<FareDetailCard {trips} flightClasses={trips.map((item) => item.classes[0])} />
		</div>
	</div>
</div>

<AddBaggageDialog bind:open={state.isAddbaggageDialogOpen} {form} />
<SeatSelectDialog bind:open={state.isSelectSeatDialogOpen} {form} />
<AddMealDialog bind:open={state.isAddMealDialogOpen} {form} {trips} />
