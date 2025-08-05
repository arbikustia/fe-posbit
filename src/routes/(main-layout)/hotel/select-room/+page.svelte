<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import Icon from '@iconify/svelte';
	import { ShareDialog } from '../search/_components/copy-hotel.svelte';
	import DetailRoomList from '../detail/_components/header/detail-room-list.svelte';
	import { CardRoom } from './_components/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { MSearchHotelPanel } from '../_components/search-hotel-panel';
	import { ShareHotels } from '../search/_components/share-hotels';
	import { useSearchForm } from '../_components/search-hotel-panel/search-hotel-panel.svelte.js';
	import MShareHotels from '../search/_components/share-hotels/m-share-hotels.svelte';

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
	let isOpenSearchPanel = $state(false);
	function openSearchPanel() {
		isOpenSearchPanel = true;
	}
	const { state: dataState } = useSearchForm();
</script>

<MOSGAppBar class="border-grey-300 flex h-24 items-start border shadow-none">
	{#snippet leftContent()}
		<div class="flex w-[60vw] flex-col justify-start">
			<span class="text-lg font-bold">The 101 Bandung</span>
			<span class="text-xs">The 101 Bandung</span>
			<span class="text-xs">The 101 Bandung </span>
		</div>
	{/snippet}
	{#snippet rightContent()}
		<div class="flex w-[10vw] items-center justify-end gap-2">
			<MShareHotels
					hotels={sharehotels}
					location={dataState.searchModel.destination}
					checkInDate={dataState.searchModel.date?.start}
					checkOutDate={dataState.searchModel.date?.start}
					guests={dataState.searchModel.guest}
					rooms={dataState.searchModel.room}
				/>
			<Button class="h-10 text-xs shadow-none" onclick={openSearchPanel}>Change</Button>
		</div>
	{/snippet}
</MOSGAppBar>

<div class="px-2 py-28">
	<CardRoom />
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
