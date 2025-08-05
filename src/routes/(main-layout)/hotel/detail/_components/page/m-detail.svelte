<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import Icon from '@iconify/svelte';
	import { ShareDialog } from '../../../search/_components/copy-hotel.svelte';
	import About from '../header/about.svelte';
	import DetailRoomList from '../header/detail-room-list.svelte';
	import TabLocation from '../../../_components/card-hotel/tabs-card-hotel/tab-location.svelte';
	import MAbout from '../header/m-about.svelte';
	import MLocation from '../header/m-location.svelte';
	import MFacilities from '../header/m-facilities.svelte';
	import MPolicy from '../header/m-policy.svelte';
	import MReview from '../header/m-review.svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import MShareHotels from '../../../search/_components/share-hotels/m-share-hotels.svelte';
	import { useSearchForm } from '../../../_components/search-hotel-panel/search-hotel-panel.svelte.js';

	const tabs = [
		{ label: 'About', id: 'about' },
		{ label: 'Locations', id: 'location' },
		{ label: 'Facilities', id: 'facilities' },
		{ label: 'Policies', id: 'policies' },
		{ label: 'Reviews', id: 'reviews' }
	];
	const { state: dataState } = useSearchForm();

	function scrollToSection(id: string, offset: number = -100) {
		const element = document.getElementById(id);
		if (element) {
			const y = element.getBoundingClientRect().top + window.scrollY + offset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}
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

<MOSGAppBar class="flex h-16 items-start shadow-none">
	{#snippet leftContent()}
		<div class="flex w-[70vw] justify-center text-lg font-bold">The 101 Bandung</div>
	{/snippet}
	{#snippet rightContent()}
		<div class="z-[100]">
			<MShareHotels
				hotels={sharehotels}
				location={dataState.searchModel.destination}
				checkInDate={dataState.searchModel.date?.start}
				checkOutDate={dataState.searchModel.date?.start}
				guests={dataState.searchModel.guest}
				rooms={dataState.searchModel.room}
			/>
		</div>
	{/snippet}
</MOSGAppBar>
<div class="shadow-xs fixed mt-16 flex h-10 w-full items-center justify-between bg-white px-3">
	{#each tabs as tab}
		<Button
			variant="link"
			onclick={() => scrollToSection(tab.id)}
			class="cursor-pointer px-2 py-1 text-sm transition-colors duration-200"
		>
			{tab.label}
		</Button>
	{/each}
</div>
<div class="space-y-3 px-3 py-32">
	<div id="about">
		<MAbout />
	</div>
	<div id="location">
		<MLocation />
	</div>
	<div id="facilities">
		<MFacilities />
	</div>
	<div id="policies">
		<MPolicy />
	</div>
	<div id="reviews">
		<MReview />
	</div>
</div>
<div
	class="z-50 fixed bottom-0 flex h-fit w-full rounded-tl-lg rounded-tr-lg border-2 border-gray-200 bg-white"
>
	<div class="flex w-[70%] flex-col justify-center gap-1 px-2 py-3 text-xs">
		<span class="font-semibold text-neutral-900"
			>Frie. 9 Mei - Sat 8 Mei 2025. 1 Room(s). 2 Guest(s)</span
		>
		<span class="text-neutral-400">Price Start From</span>
		<span class="text-sm font-bold text-red-500"
			>IDR 563,553 <span class="text-xs text-neutral-400">/room/night (includes taxes & fees)</span
			></span
		>
	</div>
	<div class="flex w-[30%] items-center justify-center px-3">
		<Button
			variant="default"
			class="w-full px-2 py-1 text-xs text-white"
			onclick={() => goto('/hotel/select-room')}>Select Room</Button
		>
	</div>
</div>
