<script lang="ts">
	import { Close, Information } from '$lib/components/icons';
	import * as Accordion from '$lib/components/ui/accordion';
	import { Card } from '$lib/components/ui/card';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import dayjs from 'dayjs';
	import { Star } from '@lucide/svelte';

	interface BookingDetails {
		hotelName: string;
		hotelAddress: string;
		hotelRating: number;
		roomType: string;
		roomFacilities: string[];
		checkIn: string;
		checkOut: string;
		nights: number;
		guests: number;
		basePrice: number;
		taxes: number;
		serviceCharge: number;
		cancellationPolicy: string;
		totalPrice: number;
		isRefundable: boolean;
	}

	// This would typically come from your booking store or props
	const bookingDetails: BookingDetails = {
		hotelName: 'The 101 Bandung',
		hotelAddress: 'Jl. Ir. H. Juanda No. 3, Dago, Bandung, Jawa Barat, Indonesia, 40115',
		hotelRating: 4,
		roomType: 'Deluxe Room',
		roomFacilities: ['Includes Breakfast', 'Double Bed'],
		checkIn: '2025-03-11',
		checkOut: '2025-03-12',
		nights: 1,
		guests: 3,
		basePrice: 800000,
		taxes: 80000,
		serviceCharge: 40000,
		cancellationPolicy: 'Non Refundable',
		totalPrice: 10000000,
		isRefundable: false
	};
</script>

<Card class="overflow-hidden">
	<div class="p-4">
		<!-- Hotel Info -->
		<div class="space-y-2">
			<h2 class="text-xl font-semibold">{bookingDetails.hotelName}</h2>
			<div class="flex items-center gap-1">
				{#each Array(5) as _, i}
					<Star
						class="h-4 w-4 {i < bookingDetails.hotelRating
							? 'fill-yellow-400 text-yellow-400'
							: 'fill-gray-200 text-gray-200'}"
					/>
				{/each}
			</div>
			<p class="text-sm text-gray-600">{bookingDetails.hotelAddress}</p>
		</div>

		<!-- Dates -->
		<div class="mt-4 flex items-center gap-2 rounded-md border bg-primary/5 p-2">
			<!-- ORIGIN -->
			<div class="text-center">
				<p class="font-semibold">Check-in</p>
				<p>{dayjs(bookingDetails.checkIn).format('ddd, DD MMM YYYY')}</p>
			</div>

			<!-- DURATION -->
			<div class="mb-px flex flex-1 items-center justify-center gap-2 self-end text-center">
				<div class="w-4 border-b border-dashed border-muted-foreground"></div>
				<div class="text-sm text-muted-foreground">
					<div class="whitespace-nowrap">1 Night</div>
				</div>

				<div class="w-4 border-b border-dashed border-muted-foreground"></div>
			</div>

			<!-- DESTINATION -->
			<div class="text-center">
				<p class="font-semibold">Check-out</p>
				<p>{dayjs(bookingDetails.checkOut).format('ddd, DD MMM YYYY')}</p>
			</div>
		</div>

		<!-- Room Details -->
		<div class="mt-4 space-y-2">
			<p class="font-medium">
				{bookingDetails.nights}
				{bookingDetails.roomType}, {bookingDetails.guests} Guests
			</p>
			{#each bookingDetails.roomFacilities as roomFacility}
				<p class="text-sm text-gray-600">{roomFacility}</p>
			{/each}
		</div>

		<!-- Cancellation Policy -->
		<div class="mt-4">
			<p class="font-medium">Cancellation Policy</p>
			<div class="mt-2 flex items-center gap-2 text-sm text-red-500">
				<Close class="h-5 w-5" />
				<div class="flex items-center gap-1">
					<p>{bookingDetails.cancellationPolicy}</p>
					<Information class="h-4 w-4" />
				</div>
			</div>
		</div>

		<!-- Total Price -->
		<Accordion.Root type="single" class="mt-4 rounded-md border">
			<Accordion.Item class={cn('overflow-hidden rounded-md border-none bg-card')} value="item-1">
				<Accordion.Trigger class="bg-primary/5 p-2 capitalize hover:no-underline">
					<div class="flex w-full items-center justify-between gap-2 pr-2">
						<p class="text-lg font-semibold">Total Payment</p>
						<p class="text-lg font-semibold">{formatThousand(bookingDetails.totalPrice)} IDR</p>
					</div>
				</Accordion.Trigger>
				<Accordion.Content class="p-0">
					<div class="mt-4 space-y-3 px-2">
						<div class="flex justify-between text-sm">
							<span>Room Rate (1 Night)</span>
							<span>{formatThousand(bookingDetails.totalPrice * 0.9)} IDR</span>
						</div>
						<div class="flex justify-between text-sm">
							<span>Taxes & Fees</span>
							<span>{formatThousand(bookingDetails.totalPrice * 0.1)} IDR</span>
						</div>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</div>
</Card>
