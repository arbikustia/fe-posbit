<script lang="ts">
	import Icon from '@iconify/svelte';
	import { FilterHotel } from '..';
	import { goto } from '$app/navigation';
	export let rooms;
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import ShareHotels from '../../../search/_components/share-hotels/share-hotels.svelte';
	import { useSearchForm } from '../../search-hotel-panel/search-hotel-panel.svelte.js';

	const { state } = useSearchForm();
	const sharehotels = [
		{
			id: 1,
			name: 'Srivijaya Hotel',
			starRating: 3,
			address: 'Jalan Veteran No. 1, Gambir, Jakarta Pusat 10110',
			price: 375000
		},
		{
			id: 2,
			name: 'Hotel Borobudur',
			starRating: 5,
			address: 'Jl. Lapangan Banteng Selatan No. 1, Pasar Baru, Sawah Besar 10710',
			price: 1025000
		}
	];
</script>

<div class="flex w-full items-end justify-end gap-2">
	<ShareHotels
		hotels={sharehotels}
		location={state.searchModel.destination}
		checkInDate={state.searchModel.date?.start}
		checkOutDate={state.searchModel.date?.start}
		guests={state.searchModel.guest}
		rooms={state.searchModel.room}
	/>
	<div class="w-44">
		<FilterHotel />
	</div>
</div>
{#each rooms as room}
	<div class={`mt-2 flex w-full flex-col gap-1 ${room.section !== '' ? '' : ''} rounded-md  `}>
		{#each room.items as item}
			<Card.Root>
				<Card.Content>
					<div
						class={`flex w-full items-center justify-center gap-5 rounded-md border-gray-400 py-1`}
					>
						<div class="flex w-[30%] flex-col justify-start gap-2 px-5 text-start">
							<div class="text-md font-semibold">{item.type}</div>
							{#if item.guaranteed == true}
								<div class="flex items-center gap-1 text-sm">
									<Icon icon="vaadin:coin-piles" width="16" height="16" style="color: #8a8a8a" />
									<span> Guaranteed Booking </span>
								</div>
							{/if}
							<div class={item.refundable ? 'text-xs text-green-600' : 'text-xs text-red-600'}>
								{#if item.refundable}
									<div class="flex items-center gap-1 text-sm">
										<Icon icon="ic:outline-check" width="20" height="20" style="color: #00e612" />
										<span>Free Cancellation</span>
									</div>
								{:else}
									<div class="flex items-center gap-1 text-sm">
										<Icon
											icon="material-symbols:close-rounded"
											width="20"
											height="20"
											style="color: #e60200"
										/>
										<span>Non-Refundable</span>
									</div>
								{/if}
							</div>
						</div>
						<div class="flex w-[20%] flex-col gap-1 text-start text-xs">
							{#if item.breakfast}
								<div class="flex items-center gap-1 text-sm">
									<Icon
										icon="mdi:free-breakfast-outline"
										width="20"
										height="20"
										style="color: #8a8a8a"
									/>
									<span class="px-1">Breakfast</span>
								</div>
							{:else}
								<div class="flex items-center gap-1 text-sm">
									<Icon
										icon="mdi:free-breakfast-off-outline"
										width="20"
										height="20"
										style="color: #8a8a8a"
									/>
									<span class="px-1">No Breakfast</span>
								</div>
							{/if}
							{#if item.isTwinBed}
								<div class="flex items-center gap-1 text-sm">
									<Icon
										icon="material-symbols-light:bed"
										width="24"
										height="24"
										style="color: #8a8a8a"
									/>
									<span>Twind Bed</span>
								</div>
							{:else}
								<div class="flex items-center gap-2">
									<Icon
										icon="material-symbols-light:bed"
										width="24"
										height="24"
										style="color: #8a8a8a"
									/>
									<span>Twind Bed</span>
								</div>
							{/if}
							{#if item.roomSize}
								<div class="flex items-center gap-2">
									<Icon icon="mdi:ruler" width="20" height="24" style="color: #8a8a8a" />
									<span>20.0 m2</span>
								</div>
							{/if}
						</div>
						<div class="w-[20%] text-end">
							<div class="text-sm"><span class="rounded-md bg-gray-200 px-2">TBO</span></div>
							<div class="text-sm">Total Price</div>
							<div class="text-md font-bold text-red-600">IDR {item.price.toLocaleString()}</div>
							<div class="text-xs">(includes taxes & fees)</div>
						</div>
						<div class="flex w-[20%] justify-center text-end">
							<Button
								onclick={() => goto('/hotel/booking')}
								class="h-8 rounded px-3 text-sm text-white "
							>
								Select Room
							</Button>
						</div>
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
{/each}
