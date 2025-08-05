<script lang="ts">
	import { OSGBookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import * as Card from '$lib/components/ui/card';

	export let bookingData: {
		type: string;
		merchant: string;
		amount: number;
		currency: string;
		provider: string; 
		location?: {
			from: {
				name: string;
				code?: string;
			};
			to?: {
				name: string;
				code?: string;
			};
		};
		details: {
			date: string;
			time?: string;
			guests?: number; 
			duration?: string;
			additionalInfo?: string;
		};
		bookingInfo: {
			status: string;
			code: string;
		};
		icon?: string; 
	}[];

	function getBookingIcon(type: string, customIcon?: string): string {
		if (customIcon) return customIcon;

		const icons:any = {
			flight:
				'https://th.bing.com/th/id/OIP.CthN3kSfaReQQskFhFewLAAAAA?rs=1&pid=ImgDetMain&cb=idpwebpc2',
			hotel:
				'https://cdn.iconscout.com/icon/premium/png-256-thumb/hotel-location-7101525-5834757.png',
			train: 'https://portalvhds11000v9mfhk0k.blob.core.windows.net/travel/kai.png',
			insurance: 'https://portalvhds11000v9mfhk0k.blob.core.windows.net/travel/zurichlogo.png'
		};

		return icons[type] || icons.flight;
	}

	function getGuestLabel(type: string): string {
		const labels:any = {
			flight: 'pax',
			train: 'pax',
			hotel: 'guests',
			insurance: 'people'
		};

		return labels[type] || 'pax';
	}
</script>

{#each bookingData as booking}
	<Card.Root class="mb-4 p-0">
		<Card.Content class="p-4">
			<div class="w-full">
					<div class="flex items-center justify-between border-b border-gray-300 pb-1">
						<div class="text-sm font-medium text-gray-600">{booking.merchant}</div>
						<div class="text-lg font-bold text-blue-600">
							{booking.amount.toLocaleString()}
							{booking.currency}
						</div>
					</div>

				<!-- Provider name -->
				<div class="pt-2">
					<div class="text-md flex items-center justify-start gap-3 font-bold">
						<img
							class="h-4 w-auto"
							src={getBookingIcon(booking.type, booking.icon)}
							alt="{booking.type} logo"
						/>
						<span>{booking.provider}</span>
					</div>
				</div>

				<!-- Location/Route details -->
				<div class="">
					{#if booking.location}
						{#if booking.location.to}
							<!-- Route format (flight, train) -->
							<div class="flex w-[60%] items-center">
								<div class="flex gap-1">
									<div class="text-lg text-gray-400">{booking.location.from.name}</div>
									{#if booking.location.from.code}
										<div class="text-md text-gray-400">({booking.location.from.code})</div>
									{/if}
								</div>
								<div class="flex-1 px-2 text-center">
									<div class="text-xs text-gray-400">→</div>
								</div>
								<div class="flex gap-1">
									<div class="text-lg text-gray-400">{booking.location.to.name}</div>
									{#if booking.location.to.code}
										<div class="text-md text-gray-400">({booking.location.to.code})</div>
									{/if}
								</div>
							</div>
						{:else}
							<!-- Single location format (hotel, insurance) -->
							<div class="flex gap-1">
								<div class="text-lg text-gray-400">{booking.location.from.name}</div>
								{#if booking.location.from.code}
									<div class="text-md text-gray-400">({booking.location.from.code})</div>
								{/if}
							</div>
						{/if}
					{/if}

					<!-- Booking details -->
					<div class="mb-4 flex justify-between text-sm">
						<div class="text-gray-400">
							<span>{booking.details.date}</span>
							{#if booking.details.time}
								• {booking.details.time}
							{/if}
							{#if booking.details.guests}
								• {booking.details.guests} {getGuestLabel(booking.type)}
							{/if}
							{#if booking.details.duration}
								• {booking.details.duration}
							{/if}
							{#if booking.details.additionalInfo}
								• {booking.details.additionalInfo}
							{/if}
						</div>
					</div>

					<!-- Status and booking code -->
					<div class="flex items-center justify-between border-t border-gray-300 pt-3">
						<OSGBookingStatus
							status={(booking.bookingInfo.status as 'reserved') || 'canceled' || 'error'}
						/>
						<div class="text-md font-medium text-blue-600">{booking.bookingInfo.code}</div>
					</div>
				</div>
			</div>
		</Card.Content>
	</Card.Root>
{/each}
