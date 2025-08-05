<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { redirectToSearchHotel, saveLastSearchHotel } from '$lib/helpers/search-hotel-helper';
	import { useLastSearch } from './last-search.svelte';
	import dayjs from 'dayjs';

	let { clearLastSearch, state } = useLastSearch();

	const hotel = {
		name: 'The Gaia Hotel Bandung',
		date: 'Mon, 10 Mar - Sun, 16 Mar',
		guests: '3 Guests',
		rooms: '2 Rooms'
	};
	const lastSearches = Array(4).fill(hotel);

	function onClickItem(search: any) {
		console.log(search);
		redirectToSearchHotel(search);
		saveLastSearchHotel(search);
	}
</script>

{#if state.lastSearches.length > 0}
	<div class="space-y-6 py-4">
		<!-- Last Search -->
		<div>
			<div class="mb-2 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-800">Last Search</h2>
				<Button variant="link" onclick={clearLastSearch} class="text-md font-medium">Clear</Button>
			</div>
			<div class="relative">
				<div class="no-scrollbar flex space-x-4 overflow-x-auto pb-4">
					{#each state.lastSearches as search}
						<Button
							variant="outline"
							onclick={() => onClickItem(search)}
							class="shadow-xs w-[90%] flex h-fit  items-center justify-between gap-5 overflow-hidden rounded-md border p-5 transition hover:shadow-sm"
						>
							<img class="w-5" src="/images/hotel-icon.png" alt="hotel-icon" />
							
							<div class="text-start">
								<h3 class="text-sm font-semibold">{search.destination}</h3>
								<p class="text-sm text-gray-600">
									{dayjs(search.date.start).format('D MMMM YYYY')}-{dayjs(search.date.end).format(
										'D MMMM YYYY'
									)}
								</p>
								<p class="text-xs text-gray-600">{search.room} Rooms • {search.guest} Guest</p>
							</div>
							<div class="text-gray-400">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-5 w-5"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 5l7 7-7 7"
									/>
								</svg>
							</div>
						</Button>
					{/each}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.no-scrollbar::-webkit-scrollbar {
		display: none;
	}
	.no-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
</style>
