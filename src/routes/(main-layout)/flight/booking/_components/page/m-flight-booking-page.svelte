<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { displayPassengerDetail } from '$lib/helpers/search-flight-helper';
	import { ChevronUp } from '@lucide/svelte';
	import { FlightRouteInfo } from '../../../_components/flight-route-info';
	import { FlightSummaryCompanyHeader } from '../../../_components/flight-summary';
	import { MAddBaggageDialog } from '../add-baggage-dialog';
	import { MBookingFlightSummary } from '../booking-flight-summary';
	import { MContactForm } from '../contact-form';
	import {
		MFlightAncillary,
		MFlightAncillaryBaggageSummary,
		MFlightAncillaryMealSummary,
		MFlightAncillarySeatSummary
	} from '../flight-ancillary';
	import { MPassengerForm } from '../passenger-form';
	import { useFlightBookingPage } from './flight-booking-page.svelte.js';
	import { MSeatSelectDialog } from '../seat-select-dialog';
	import MAddMealDialog from '../add-meal-dialog/m-add-meal-dialog.svelte';
	import { ancillaryIconUrl } from '$lib/constants/app';

	const { trips, state, form, formData, enhance, errors, handleSubmit } = useFlightBookingPage();
</script>

<div>
	<MOSGAppBar class="bg-primary text-primary-foreground">
		{#snippet leftContent()}
			<div>
				<FlightRouteInfo origin="Jakarta" destination="Denpasar" flightType="roundtrip" />
				<p class="text-xs">
					{displayPassengerDetail({
						adult: 1,
						child: 1,
						infant: 1
					})}
				</p>
			</div>
		{/snippet}
	</MOSGAppBar>

	<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data">
		<div class="pt-20">
			<div class="space-y-6 px-4 pb-28">
				<FlightSummaryCompanyHeader companyName="PT. Reka Sinergi Pratama" />
				<MBookingFlightSummary />
				<div class="space-y-4">
					<div class="text-lg font-semibold">Passenger Detail</div>
					{#each $formData.passengers as _, idx}
						<MPassengerForm
							bind:parentFormData={$formData}
							formIdx={idx}
							isError={!!$errors?.passengers?.[idx]?.title}
						/>
					{/each}
				</div>
				<div class="space-y-4">
					<div class="text-lg font-semibold">Flight Ancillary</div>
					<MFlightAncillary
						title="Baggage"
						iconSrc={ancillaryIconUrl.baggage}
						actionTitle="Add Baggage"
						action={() => (state.isAddbaggageDialogOpen = true)}
					>
						{#snippet summaryContent()}
							<MFlightAncillaryBaggageSummary baggages={$formData.ancillary.baggages} {trips} />
						{/snippet}
					</MFlightAncillary>
					<MFlightAncillary
						title="Seat"
						iconSrc={ancillaryIconUrl.seat}
						actionTitle="Pick Seat"
						action={() => (state.isSelectSeatDialogOpen = true)}
					>
						{#snippet summaryContent()}
							<MFlightAncillarySeatSummary seats={$formData.ancillary.seats} {trips} />
						{/snippet}
					</MFlightAncillary>
					<MFlightAncillary
						title="Meals"
						iconSrc={ancillaryIconUrl.meal}
						actionTitle="Add Meals"
						action={() => (state.isAddMealDialogOpen = true)}
					>
						{#snippet summaryContent()}
							<MFlightAncillaryMealSummary meals={$formData.ancillary.meals} {trips} />
						{/snippet}
					</MFlightAncillary>
				</div>
				<div class="space-y-4">
					<div class="text-lg font-semibold">Booking Contact</div>
					<MContactForm bind:parentFormData={$formData} isError={!!$errors.title} />
				</div>
			</div>
			<div class="fixed bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
				<div>
					<p class="text-sm">Total for all pax</p>
					<button class="flex items-center gap-x-1" type="button" onclick={() => {}}>
						<p class="font-semibold">
							{formatThousand(1000000)}
							IDR
						</p>
						<ChevronUp class="h-5 w-5" />
					</button>
				</div>
				<Button type="submit" class="px-8">Book Now</Button>
			</div>
		</div>
	</form>
</div>

<MAddBaggageDialog bind:open={state.isAddbaggageDialogOpen} {form} {trips} />
<MSeatSelectDialog bind:open={state.isSelectSeatDialogOpen} {form} />
<MAddMealDialog bind:open={state.isAddMealDialogOpen} {form} {trips} />
