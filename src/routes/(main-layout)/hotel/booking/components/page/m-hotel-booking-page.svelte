<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import Button from '$lib/components/ui/button/button.svelte';
	import { defaults, superForm } from 'sveltekit-superforms';

	import {
		BookingContactDrawer,
		GuestDetailDrawer,
		HotelDetailDrawer,
		RemarkHotelDrawer,
		RemarkInternalUseDrawer
	} from '../hotel-drawer';
	import { zod } from 'sveltekit-superforms/adapters';
	import { bookingSchema, guestSchema, remarkHotelSchema } from './schema';
	import { onMount } from 'svelte';
	import type { z } from 'zod';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

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
			goto("/hotel/booking/review-reservation")
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

<MOSGAppBar class="border-grey-300 flex h-16 items-start border bg-blue-500 text-white shadow-none">
	{#snippet leftContent()}
		<div class="flex w-[60vw] flex-col justify-start">
			<span class="text-lg font-bold">Booking Form</span>
		</div>
	{/snippet}
</MOSGAppBar>


<div class="mt-20 flex flex-col px-2 pb-24">
	<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data" class="space-y-6">
		<p class="mb-7">PT. Reka Sinergi Pratama</p>
		<HotelDetailDrawer />
		<GuestDetailDrawer {form} />
		<RemarkInternalUseDrawer {form} />
		<RemarkHotelDrawer {form} />
		<BookingContactDrawer {form} />
		<div
			class="fixed bottom-0 flex h-20 w-full items-center justify-center border-t border-gray-500 bg-white"
		>
			<div class="mt-8">
				<Button type="submit" class="w-full">Review Your Reservation</Button>
			</div>
		</div>
	</form>
</div>
