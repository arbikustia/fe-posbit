<script lang="ts">
	import { goto } from '$app/navigation';
	import Icon from '@iconify/svelte';
	export let hotel: {
		name: string;
		location: string;
		price: number;
		rating: number;
		address: string;
	};

	function NavigateToDetail() {
		goto('/hotel/detail');
	}
</script>

<button
	on:click={NavigateToDetail}
	class="shadow-xs flex w-full max-w-md items-center rounded-lg border bg-white p-3"
>
	<!-- Image Placeholder -->
	<!-- <div class="mr-4 h-24 w-24 rounded-md bg-gray-100"></div> -->
	<img
		alt=""
		class="w-22 mr-4 rounded-md"
		src="https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain"
	/>

	<!-- Hotel Info -->
	<div class="flex-1">
		<!-- Name -->
		<div class="cursor-pointer text-start font-semibold text-blue-700 hover:underline">
			{hotel.name}
		</div>

		<!-- Rating -->
		<div class="mt-1 flex items-center space-x-1">
			{#each Array(hotel.rating) as _}
				<span class="text-sm text-yellow-400">★</span>
			{/each}
		</div>

		<!-- Location -->
		<div class="mt-1 flex items-center gap-1 text-xs text-gray-600">
			<Icon icon="fluent:location-48-filled" width="12" height="12" style="color: #b20000" />
			{hotel.location}
		</div>

		<!-- Price -->
		<div class="mt-2 flex items-end justify-between">
			<div>
				<div class="text-xs font-semibold text-black">10 Room Types Available</div>
				<div class="text-xs text-gray-400">(includes taxes & fees)</div>
			</div>
			<div class="text-right">
				<div class="text-sm font-bold text-red-500">{hotel.price.toLocaleString()} IDR</div>
				<div class="text-xs text-gray-500">/room/night</div>
			</div>
		</div>
	</div>
</button>
