<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { displayPassengerDetail } from '$lib/helpers/search-train-helper';
	import { ChevronUp } from '@lucide/svelte';
	import { TripRouteInfo } from '../../../_components/trip-route-info';
	import { MBookingSummary } from '../booking-summary';
	import { useTrainBookingPage } from './train-booking-page.svelte.js';
	import { Button } from '$lib/components/ui/button';
	import { MPassengerForm } from '../passenger-form';
	import { PickSeat } from '../pick-seat';
	import { MContactForm } from '../contact-form';
	import { MSeatSelectDialog } from '../seat-select-dialog';

	const { state, formData, enhance, handleSubmit, errors } = useTrainBookingPage();
</script>

<MOSGAppBar class="bg-primary text-primary-foreground">
	{#snippet leftContent()}
		<div>
			<TripRouteInfo origin="Gambir" destination="Bandung" tripType="roundtrip" />
			<p class="text-xs">
				{displayPassengerDetail({
					adult: 1,
					infant: 1
				})}
			</p>
		</div>
	{/snippet}
</MOSGAppBar>

<div class="px-4 pt-20">
	<MBookingSummary />
	<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data">
		<div class="mt-4 space-y-4">
			<div class="text-lg font-semibold">Passenger Detail</div>
			{#each $formData.passengers as _, i}
				<MPassengerForm
					bind:parentFormData={$formData}
					formIdx={i}
					isError={!!$errors?.passengers?.[i]?.title}
				/>
			{/each}
			<div class="text-lg font-semibold">Seat</div>
			<PickSeat onclick={() => (state.isOpenSelectSeatDialog = true)} />
			<div class="text-lg font-semibold">Booking Contact</div>
			<MContactForm bind:parentFormData={$formData} isError={!!$errors.title} />
		</div>

		<div
			class="absolute bottom-0 left-0 right-0 flex items-center justify-between border-t-2 bg-white p-4"
		>
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
	</form>
</div>

<MSeatSelectDialog bind:open={state.isOpenSelectSeatDialog} />
