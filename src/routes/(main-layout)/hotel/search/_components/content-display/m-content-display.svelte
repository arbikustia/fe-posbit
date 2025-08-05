<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';
	import { ShareDialog } from '../copy-hotel.svelte';
	import { MSearchHotelPanel } from '../../../_components/search-hotel-panel';
	import { MobileFilter } from '../mobile-filter';
	import MobileSortBy from '../mobile-sort-by/mobile-sort-by.svelte';
	import { MobilePriceRange } from '../mobile-price-range';
	import { MCardHotel } from '../../../_components/card-hotel';
	import ShareHotels from '../share-hotels/share-hotels.svelte';
	import { MShareHotels } from '../share-hotels';
	import { useSearchForm } from '../../../_components/search-hotel-panel/search-hotel-panel.svelte.js';
	let isOpenSearchPanel = $state(false);
	function openSearchPanel() {
		isOpenSearchPanel = true;
	}

	const { state:dataState } = useSearchForm();
	const hotels = [
		{
			name: 'Four Points by Sheraton',
			location: 'Bandung Wetan',
			price: 1452000,
			rating: 4,
			address: 'Jl. Ir. H. Juanda No. 33, Bandung'
		},
		{
			name: 'ibis Styles Bandung Grand Central',
			location: 'Bandung Wetan',
			price: 562464,
			rating: 3,
			address: 'Jl. Diponegoro No. 27, Bandung'
		},
		{
			name: 'Tama Boutique Hotel',
			location: 'Pasirkaliki, Bandung',
			price: 696795,
			rating: 5,
			address: 'Jl. Dr. Rum No. 1, Bandung'
		},
		{
			name: 'Tama Boutique Hotel1',
			location: 'Pasirkaliki, Bandung',
			price: 696795,
			rating: 5,
			address: 'Jl. Dr. Rum No. 1, Bandung'
		},
		{
			name: 'Tama Boutique Hote2',
			location: 'Pasirkaliki, Bandung',
			price: 696795,
			rating: 5,
			address: 'Jl. Dr. Rum No. 1, Bandung'
		}
	];
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
		// ... other hotels
	];

	const checkInDate = new Date('2025-03-11');
	const checkOutDate = new Date('2025-03-12');
	const guests = 2;
	const rooms = 2;
</script>

<div>
	<MOSGAppBar class="flex h-24 items-start shadow-none">
		{#snippet leftContent()}
			<div>
				<div class="flex items-center gap-1 font-semibold">
					<div class="flex flex-col">
						<div>
							<span class="text-lg font-bold">Jakarta</span>
							<span class="text-lg text-gray-600">(2345 Hotel)</span>
						</div>
						<span class="text-xs text-gray-600">6 Mei-8 Mei . 2 Night(s)</span>
						<span class="text-xs text-gray-600">1 Room(s) . 1 Guest(s)</span>
					</div>
				</div>
			</div>
		{/snippet}
		{#snippet rightContent()}
			<div>
				<MShareHotels
					hotels={sharehotels}
					location={dataState.searchModel.destination}
					checkInDate={dataState.searchModel.date?.start}
					checkOutDate={dataState.searchModel.date?.start}
					guests={dataState.searchModel.guest}
					rooms={dataState.searchModel.room}
				/>
				<Button class="" onclick={openSearchPanel}>Change</Button>
			</div>
		{/snippet}
	</MOSGAppBar>
	<div class="shadow-xs fixed mt-[75px] flex h-16 px-1 w-full items-center justify-center bg-white">
		<div class="flex w-[24%] items-center justify-start">
			<div class="flex justify-start items-start gap-4">
				<MobileFilter />
				<MobileSortBy />
			</div>
			<Icon icon="pepicons-pop:line-y" width="36" height="36" style="color: #a2a2a2" />
		</div>
		<div class="no-scrollbar  hide-scrollbar flex w-[68%] items-center gap-1 overflow-x-auto">
			<MobilePriceRange />
			<div
				class="flex w-fit justify-center gap-3 rounded-md border border-blue-800 bg-white px-5 py-2 text-black"
			>
				<span>3</span>
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #f0d700" />
			</div>
			<div
				class="flex w-fit justify-center gap-3 rounded-md border border-blue-800 bg-white px-5 py-2 text-black"
			>
				<span>4</span>
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #f0d700" />
			</div>
			<div
				class="flex w-fit justify-center gap-3 rounded-md border border-blue-800 bg-white px-5 py-2 text-black"
			>
				<span>5</span>
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #f0d700" />
			</div>
			<div
				class="flex w-fit justify-center gap-1 rounded-md border border-blue-800 bg-white px-5 py-2  text-black"
			>
				<span>Free</span>
				<span>Cancellation</span>
			</div>
		</div>
	</div>
</div>
<div class="space-y-4 p-4 pt-36">
	{#each hotels as hotel}
		<MCardHotel {hotel} />
	{/each}
</div>

<Drawer.Root bind:open={isOpenSearchPanel}>
	<Drawer.Content class="p-4">
		<Drawer.Header>
			<Drawer.Title>Change Search Criteria</Drawer.Title>
		</Drawer.Header>
		<div class="max-h-[70vh] overflow-y-auto">
			<MSearchHotelPanel />
		</div>
	</Drawer.Content>
</Drawer.Root>

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
