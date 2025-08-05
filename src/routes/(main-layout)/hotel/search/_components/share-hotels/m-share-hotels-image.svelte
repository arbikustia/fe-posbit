<script lang="ts">
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import { Badge } from '$lib/components/ui/badge';
	import { displayDate } from '$lib/helpers/date-helper';
	import { formatThousand } from '$lib/helpers/number-helper';
	// import type { Hotel } from '$lib/types/HotelResponse';
	import { cn } from '$lib/utils';
	import dayjs from 'dayjs';

	type ShareHotelImageProps = {
		hotels: any[];
		checkInDate: Date;
		checkOutDate: Date;
		guests: number;
		rooms: number;
	};

	let { hotels, checkInDate, checkOutDate, guests, rooms }: ShareHotelImageProps = $props();

	const thClass = 'bg-primary py-2 pr-4 text-start text-white';
	const tdClass = 'pr-4 py-1';
</script>

<div class="bg-white">
	<div class="px-4 pt-4">
		<img class="block h-8 w-auto" src="/images/opsigo-logo.png" alt="Opsigo" />
	</div>

	<div class="my-2 px-4">
		<div class="flex items-center justify-between">
			<div class="font-semibold">
				Hotel Booking Summary
			</div>

			<p class="text-xs text-muted-foreground">
				Generated on {dayjs().format('dddd, DD MMM YYYY HH:mm')}
			</p>
		</div>
		<div class="flex items-center justify-between text-sm">
			<p>
				Period: {dayjs(checkInDate, 'ddd, DD MMMM YYYY')} - {dayjs(checkOutDate, 'ddd, DD MMMM YYYY')}
			</p>
			<p>
				{hotels.length} hotels selected
			</p>
		</div>
		<div class="text-sm">
			Guests: {guests}, Rooms: {rooms}
		</div>
	</div>
	<div class="px-4 pb-4">
		<table class="rounded-md text-sm">
			<thead>
				<tr>
					<th class={cn(thClass, 'px-2 py-1')}>No</th>
					<th class={thClass}>Hotel Name</th>
					<th class={thClass}>Rating</th>
					<th class={thClass}>Address</th>
					<th class={cn(thClass, 'text-end')}>Price/night</th>
				</tr>
			</thead>
			<tbody>
				{#each hotels as hotel, hotelIdx}
					<tr
						class={cn({
							'bg-primary/10': hotelIdx % 2 !== 0,
							'border-b border-primary': hotelIdx === hotels.length - 1
						})}
					>
						<td class={cn(tdClass, 'px-2 text-center')}>
							{hotelIdx + 1}
						</td>
						<td class={cn(tdClass, 'font-medium')}>
							{hotel.name}
						</td>
						<td class={tdClass}>
							{'★'.repeat(hotel.starRating)}
						</td>
						<td class={tdClass}>
							{hotel.address}
						</td>
						<td class={cn(tdClass, 'text-end font-semibold')}>
							Rp {formatThousand(hotel.price)}
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>