<script lang="ts">
	import { Share } from '$lib/components/icons';
	import { OSGHtmlToImage } from '$lib/components/opsigo-ui/html-to-image';
	import { buttonVariants } from '$lib/components/ui/button/';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Label } from '$lib/components/ui/label/';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet/';
	import { displayDate } from '$lib/helpers/date-helper';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { copyToClipboard } from '$lib/utils';
	import dayjs from 'dayjs';
	import ShareHotelItem from './share-hotels-item.svelte';
	import { ChevronUp, Clipboard, Image } from '@lucide/svelte';

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

	function formatDisplayDate(dateString: string): string {
		return dayjs(dateString).format('ddd, DD MMMM YYYY');
	}

	let { hotels, location, checkInDate, checkOutDate, guests, rooms }: ShareHotelProps = $props();

	let selectedHotels = $state<HotelResult[]>([]);

	function handleSelectHotel(hotel: HotelResult) {
		const hasSelected = !!selectedHotels.find((item) => item.id === hotel.id);

		if (hasSelected) {
			selectedHotels = selectedHotels.filter((item) => item.id !== hotel.id);
		} else {
			selectedHotels = [...selectedHotels, hotel];
		}
	}

	function handleSelectAllHotels() {
		if (selectedHotels.length === hotels.length) {
			selectedHotels = [];
		} else {
			selectedHotels = [...hotels];
		}
	}

	function copySimpleFormat() {
		let text = '';
		selectedHotels.forEach((hotel) => {
			text += `${hotel.name}, ${hotel.starRating} star, ${hotel.address}, ${formatThousand(hotel.price)} IDR`;
			text += '\n';
		});

		copyToClipboard(text);
	}

	function copyRegularFormat() {
		let text = `Hotel Options\n${location}\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nGuests: ${guests}, Rooms: ${rooms}\n\n${selectedHotels.length} hotels found\n\n`;

		selectedHotels.forEach((hotel, idx) => {
			text += `${idx + 1}. ${hotel.name}\nStar: ${hotel.starRating}\nAddress: ${hotel.address}\nPrice: ${formatThousand(hotel.price)} IDR\n\n`;
		});

		copyToClipboard(text);
	}

	function copyFormattedFormat() {
		let text = `*Hotel Options*\n${location}\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate}\nGuests: ${guests}, Rooms: ${rooms}\n\n_${selectedHotels.length} hotels found_\n\n`;

		selectedHotels.forEach((hotel, idx) => {
			text += `*${idx + 1}. ${hotel.name}*\n⭐ ${'★'.repeat(hotel.starRating)}${'☆'.repeat(5 - hotel.starRating)}\n📍 ${hotel.address}\n💵 *${formatThousand(hotel.price)} IDR*\n\n`;
		});

		copyToClipboard(text);
	}
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Share />
	</Sheet.Trigger>
	<Sheet.Content side="right" class="px-0 md:max-w-104">
		<Sheet.Header class="space-y-0 px-4 pb-2">
			<Sheet.Title>Share Hotel Options</Sheet.Title>
			<Sheet.Description>
				<p>{location}</p>
				<p>
					{formatDisplayDate(checkInDate)} - {formatDisplayDate(checkOutDate)}
				</p>
				<p>{guests} guests, {rooms} rooms</p>
			</Sheet.Description>
			<Separator class="my-4!" />
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<div class="flex items-center gap-2">
					<Checkbox
						bind:checked={() => selectedHotels.length === hotels.length, () => {}}
						onclick={handleSelectAllHotels}
					/>
					<Label class="text-xs">Select All Hotels</Label>
				</div>
				<div>{selectedHotels.length} Hotels Selected</div>
			</div>
		</Sheet.Header>
		<div class="custom-scrollbar h-full overflow-y-auto bg-neutral-100 pb-44 pl-4 pr-2 pt-4">
			<div class="rounded-md border-2 border-b bg-white">
				{#each hotels as hotel, i}
					{@const checked = !!selectedHotels.find((item) => item.id === hotel.id)}
					<ShareHotelItem
						{hotel}
						onCheck={() => handleSelectHotel(hotel)}
						{checked}
						index={i + 1}
					/>
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 w-full border-t bg-white px-4 py-2">
			<div class="flex items-center gap-4">
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
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants()} disabled={selectedHotels.length < 1}>
						<Clipboard /> Select Copy Style <ChevronUp />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start">
						<DropdownMenu.Group>
							<DropdownMenu.Item onclick={copyRegularFormat}>Regular Format</DropdownMenu.Item>
							<DropdownMenu.Item onclick={copySimpleFormat}>Simple Format</DropdownMenu.Item>
							<DropdownMenu.Item onclick={copyFormattedFormat}>Formatted Format</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
