<script lang="ts">
	import { Close, Share } from '$lib/components/icons';
	import { OSGHtmlToImage } from '$lib/components/opsigo-ui/html-to-image';
	import { Button, buttonVariants } from '$lib/components/ui/button/';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Drawer from '$lib/components/ui/drawer/';
	import { Label } from '$lib/components/ui/label/';
	import { Separator } from '$lib/components/ui/separator';
	import { displayDate } from '$lib/helpers/date-helper';
	import { Bold, ChevronRight, ChevronUp, Clipboard, ClipboardList, Image } from '@lucide/svelte';
	import MShareHotelItem from './m-share-hotels-item.svelte';
	import ShareHotelImage from './m-share-hotels-image.svelte';
	import dayjs from 'dayjs';
	import { formatThousand } from '$lib/helpers/number-helper';

	// export let hotels: any = [];
	// export let checkInDate: Date;
	// export let checkOutDate: Date;
	// export let guests: number;
	// export let rooms: number;
	interface HotelResult {
		id: number;
		name: string;
		starRating: number;
		address: string;
		price: number;
	}
	type ShareHotelProps = {
		hotels: HotelResult[];
		location: string;
		checkInDate: string;
		checkOutDate: string;
		guests: number;
		rooms: number;
	};

	let { hotels, location, checkInDate, checkOutDate, guests, rooms }: ShareHotelProps = $props();
	let selectedHotels = hotels;

	const copySimpleFormat = (showToast = true) => {
		let text = `Hotel Booking:\n`;
		text += `Check-in: ${dayjs(checkInDate, 'ddd, DD MMM YYYY')}\n`;
		text += `Check-out: ${dayjs(checkOutDate, 'ddd, DD MMM YYYY')}\n`;
		text += `Guests: ${guests}, Rooms: ${rooms}\n\n`;

		selectedHotels.forEach((hotel: any) => {
			text += `🏨 ${hotel.name} (${'★'.repeat(hotel.starRating)})\n`;
			text += `📍 ${hotel.address}\n`;
			text += `💵 Rp ${hotel.price.toLocaleString('id-ID')}\n\n`;
		});

		navigator.clipboard.writeText(text);
		if (showToast) {
			// Show success toast
		}
	};

	const copyFormattedFormat = (showToast = true) => {
		let text = `*Hotel Booking*\n\n`;
		text += `*Check-in:* ${dayjs(checkInDate, 'ddd, DD MMM YYYY')}\n`;
		text += `*Check-out:* ${dayjs(checkOutDate, 'ddd, DD MMM YYYY')}\n`;
		text += `*Guests:* ${guests}, *Rooms:* ${rooms}\n\n`;

		selectedHotels.forEach((hotel: any) => {
			text += `*${hotel.name}* (${'★'.repeat(hotel.starRating)})\n`;
			text += `${hotel.address}\n`;
			text += `Rp ${hotel.price.toLocaleString('id-ID')}\n\n`;
		});

		navigator.clipboard.writeText(text);
		if (showToast) {
			// Show success toast
		}
	};

	const copyRegularFormat = (showToast = true) => {
		let text = `Hotel Booking Details:\n\n`;
		text += `Period: ${dayjs(checkInDate, 'DD MMM YYYY')} - ${dayjs(checkOutDate, 'DD MMM YYYY')}\n`;
		text += `Guests: ${guests}, Rooms: ${rooms}\n\n`;
		text += `Selected Hotels:\n`;

		selectedHotels.forEach((hotel: any, index: number) => {
			text += `${index + 1}. ${hotel.name} (${hotel.starRating} stars)\n`;
			text += `   Address: ${hotel.address}\n`;
			text += `   Price: Rp ${hotel.price.toLocaleString('id-ID')}\n\n`;
		});

		navigator.clipboard.writeText(text);
		if (showToast) {
			// Show success toast
		}
	};

	function formatDisplayDate(dateString: string): string {
		return dayjs(dateString).format('ddd, DD MMMM YYYY');
	}
</script>


<Drawer.Root>
	<Drawer.Trigger
		class={buttonVariants({ variant: 'outline', class: ' py-0 text-xs shadow-none' })}
	>
		<Share />
	</Drawer.Trigger>

	<Drawer.Content>
		<Drawer.Header class="relative space-y-0 px-0 pb-2 text-start">
			<div class="px-4">
				<Drawer.Title class="mb-2 flex items-center gap-2"
					><Share /> Share Hotel Booking</Drawer.Title
				>
			</div>
		</Drawer.Header>
		<div class="p-4">
			<div class="rounded-md border px-2 pt-2">
				<p class="text-sm text-gray-500">Text</p>
				<MShareHotelItem label="Regular Format" onclick={() => copyRegularFormat(true)}>
					{#snippet icon()}
						<ClipboardList class="h-5 w-5" />
					{/snippet}
				</MShareHotelItem>
				<Separator />
				<MShareHotelItem label="Simple Format" onclick={() => copySimpleFormat(true)}>
					{#snippet icon()}
						<ClipboardList class="h-5 w-5" />
					{/snippet}
				</MShareHotelItem>
				<Separator />
				<MShareHotelItem label="Formatted Format" onclick={() => copyFormattedFormat(true)}>
					{#snippet icon()}
						<Bold class="h-5 w-5" />
					{/snippet}
				</MShareHotelItem>
			</div>

			<div class="mt-4 flex items-center justify-between rounded-md border p-2">
				<OSGHtmlToImage
					filename="copsigo-hotel-options-{formatDisplayDate(checkInDate)}.png"
					variant="outline"
					disabled={selectedHotels.length < 1}
				>
					{#snippet html()}
						<div class="w-[1000px] bg-white p-6">
							<!-- Header -->
							<div class="mb-6">
								<img class="mb-5 block h-8 w-auto" src="/images/opsigo-logo.png" alt="Opsigo" />
								<div class="flex gap-10">
									<div class="mt-2">
										<h2 class="w-44 font-semibold text-black">Bandung, Indonesia</h2>
										<p class="mt-2">{selectedHotels.length} Hotels Available</p>
									</div>
									<div class="flex w-[300px] flex-col">
										<div class="mt-2 flex">
											<div class="w-[130px] font-semibold text-black">Check-in Date</div>
											<div class="">{formatDisplayDate(checkInDate)}</div>
										</div>
										<div class="mt-2 flex">
											<span class="w-[130px] font-semibold text-black">Check-out Date</span>
											<span class="">{formatDisplayDate(checkOutDate)}</span>
										</div>
									</div>
									<div class="flex w-[300px] flex-col">
										<div class="mt-2 flex">
											<span class="w-[80px] font-semibold text-black">Guest(s)</span>
											<span class="">{guests} people</span>
										</div>
										<div class="mt-2 flex">
											<span class="w-[80px] font-semibold text-black">Rooms(s)</span>
											<span class="">{rooms} rooms</span>
										</div>
									</div>
								</div>
							</div>

							<!-- Hotel Table -->
							<table class="w-full border-collapse">
								<thead class="">
									<tr class="text-md border-b bg-blue-700 text-left font-bold text-white">
										<th class="px-4 py-3">No</th>
										<th class="px-4 py-3">Hotel Name</th>
										<th class="px-4 py-3">Star</th>
										<th class="px-4 py-3">Address</th>
										<th class="absolute flex px-4 py-3 text-right"
											>Price <div
												class="relative right-0 top-0 h-1 w-1 rounded-full bg-red-500"
											></div></th
										>
									</tr>
								</thead>
								<tbody>
									{#each selectedHotels as hotel, i}
										<tr class={`border-b ${i % 2 == 0 ? '' : 'bg-blue-100'}`}>
											<td class="border-b border-blue-500 px-[16px] py-[12px] text-left">{i + 1}</td
											>
											<td class="border-b border-blue-500 px-[16px] py-[12px] text-left"
												>{hotel.name}</td
											>
											<td class="border-b border-blue-500 px-[16px] py-[12px] text-left"
												>{hotel.starRating}</td
											>
											<td class="border-b border-blue-500 px-[16px] py-[12px] text-left"
												>{hotel.address}</td
											>
											<td class="border-b border-blue-500 px-[16px] py-[12px] text-left"
												>IDR {formatThousand(hotel.price)}</td
											>
										</tr>
									{/each}
								</tbody>
							</table>

							<!-- Footer -->
							<div class="mt-6 flex justify-between text-right text-sm text-gray-500">
								<span
									><span class="text-red-500">*</span>The price shown is the lowest price per room
									per night</span
								>
								<span>
									Generated on {dayjs().format('dddd, DD MMM YYYY HH:mm')}
								</span>
							</div>
						</div>
					{/snippet}
					{#snippet actionContent()}
						<Image />
						Download as Image
					{/snippet}
				</OSGHtmlToImage>
				<ChevronRight class="text-primary" />
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
