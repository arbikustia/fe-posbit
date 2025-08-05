<script lang="ts">
	import { GuestDetails } from '../guest-details';
	import { Button } from '$lib/components/ui/button';
	import { BookingContact } from '../booking-contact';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { bookingSchema, guestSchema, remarkHotelSchema } from './schema';
	import { toast } from 'svelte-sonner';
	import type { z } from 'zod';
	import { onMount } from 'svelte';
	import { RemarksInternal } from '../remarks-internal';
	import { RemarksHotel } from '../remarks-hotel';
	import { ReservationSummary } from '../reservation-summary';

	const guest = 2; //temporary value
	const room = 2; //temporary value

	const form = superForm(defaults(zod(bookingSchema)), {
		SPA: true,
		validators: zod(bookingSchema),
		dataType: 'json',
		resetForm: false
	});

	const { form: formData, enhance, validateForm, errors } = form;

	function generateGuests() {
		const guests: z.infer<typeof guestSchema>[] = [];

		for (let i = 0; i < guest; i++) {
			guests.push({
				title: '',
				firstName: '',
				lastName: '',
				phone: '',
				remarks: [
					{
						number: 1,
						value: '',
						file: null
					}
				]
			});
		}

		return guests;
	}

	function generateRemarkHotelInitialValues() {
		const remarks: z.infer<typeof remarkHotelSchema>[] = [];

		for (let i = 0; i < room; i++) {
			remarks.push({
				bedType: false,
				highFloor: false,
				nonSmokingRoom: false,
				checkInTime: false,
				checkOutTime: false,
				other: false,
				bedTypeValue: '',
				checkInTimeValue: '14:00',
				checkOutTimeValue: '12:00',
				otherValue: ''
			});
		}

		return remarks;
	}

	async function handleSubmit() {
		var result = await validateForm({ update: true });
		if (result.valid) {
			toast.success('Book Now');

			console.log($formData, 'formdata');
		} else {
			toast.error('Please check your input');
		}
	}

	onMount(() => {
		$formData = {
			...$formData,
			guests: generateGuests(),
			remarksHotel: generateRemarkHotelInitialValues()
		};
	});
</script>

<div class="container">
	<h1 class="mb-6 text-2xl font-bold">Booking Form</h1>

	<div class="grid grid-cols-12 gap-6">
		<!-- Main Form Column -->
		<div class="col-span-7 space-y-6">
			<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data" class="space-y-6">
				<section>
					<GuestDetails {form} />
				</section>

				<section>
					<RemarksInternal {form} />
				</section>

				<section>
					<RemarksHotel {form} />
				</section>

				<section>
					<BookingContact {form} />
				</section>

				<div class="mt-8">
					<Button type="submit" class="w-full">Review Your Reservation</Button>
				</div>
			</form>
		</div>

		<!-- Reservation Summary Column -->
		<div class="col-span-5">
			<div class="sticky top-4">
				<ReservationSummary />
			</div>
		</div>
	</div>
</div>
