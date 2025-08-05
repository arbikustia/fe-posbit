<script lang="ts">
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { bookingSchema } from './schema';
	import * as Form from '$lib/components/ui/form';
	import { useTrainBookingPage } from './train-booking-page.svelte.js';
	import { PassengerForm } from '../passenger-form';
	import { ContactForm, MContactForm } from '../contact-form';
	import * as Card from '$lib/components/ui/card';
	import { ancillaryIconUrl } from '$lib/constants/app';
	import { Button } from '$lib/components/ui/button';
	import { slide } from 'svelte/transition';
	import { BookingSummary } from '../booking-summary';
	import { FareDetail } from '../../../_components/fare-detail';
	import { SeatSelectDialog } from '../seat-select-dialog';
	import { PickSeat } from '../pick-seat';

	const { state, form, formData, enhance, handleSubmit } = useTrainBookingPage();
</script>

<div class=" container space-y-4">
	<h1 class="mb-8 text-3xl font-semibold">Booking Form</h1>

	<div class="grid grid-cols-12 gap-10">
		<!-- Left Side -->
		<div class="col-span-7">
			<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data">
				<div class="space-y-6">
					{#each $formData.passengers as _, i}
						<PassengerForm {form} formIdx={i} />
					{/each}
					<PickSeat onclick={() => (state.isOpenSelectSeatDialog = true)} />

					<ContactForm {form} />
					<Form.Button size="lg" class="w-full">Book Now</Form.Button>
				</div>
			</form>
		</div>

		<!-- Right Side -->
		<div class="col-span-5">
			<div class="sticky top-4 space-y-4">
				<div transition:slide>
					<BookingSummary />
				</div>
				<div transition:slide>
					<FareDetail />
				</div>
			</div>
		</div>
	</div>
</div>

<SeatSelectDialog bind:open={state.isOpenSelectSeatDialog} />
