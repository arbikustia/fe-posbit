<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { CarouselPrice } from '../../search/_components/carousel-price';
	import { CardHotel } from '../../_components/card-hotel';
	import { hotel_result } from '$lib/dummy/hotel-search.json';
	import { useSearchHotelPage } from './hotel-search-page.svelte';
	import {
		filterHotelsByStar,
		selectedStars
	} from '../_components/content-display/content-display.svelte.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { ShareHotels } from '../_components/share-hotels';
	import { useSearchForm } from '../../_components/search-hotel-panel/search-hotel-panel.svelte.js';
	import Icon from '@iconify/svelte';
	import { TableHotel } from '../../_components/table-hotel';
	const { hotels, selectedSort, triggerContent, sort_hotels } = useSearchHotelPage();
	$: filteredHotels = filterHotelsByStar($hotels, $selectedStars);
	const { state } = useSearchForm();
	import * as Card from '$lib/components/ui/card/index.js';

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

<section class="flex flex-col space-y-3">
	<Tabs.Root value="list" class="w-full">
		<Tabs.Content value="list">
			<div class="flex w-full flex-wrap items-start justify-between gap-3">
				<div>
					<div class="text-md">
						<span class="font-semibold text-blue-600">{hotel_result.length}</span>
						<span class="font-semibold text-neutral-600">Hotels Found</span>
					</div>
					<div class="text-md font-semibold">{state.searchModel.destination}</div>
				</div>

				<div class="flex items-end justify-end gap-2">
					<Tabs.List>
						<Tabs.Trigger value="list"
							><Icon
								icon="ic:sharp-list"
								width="24"
								height="24"
								style="color: #6f6f6f"
							/></Tabs.Trigger
						>
						<Tabs.Trigger value="table">
							<Icon icon="fluent:table-20-regular" width="20" height="20" style="color: #6f6f6f" />
						</Tabs.Trigger>
					</Tabs.List>
					<div class="flex items-center gap-2">
						<ShareHotels
							hotels={sharehotels}
							location={state.searchModel.destination}
							checkInDate={state.searchModel.date?.start}
							checkOutDate={state.searchModel.date?.start}
							guests={state.searchModel.guest}
							rooms={state.searchModel.room}
						/>
					</div>

					<!-- Sort -->
					<div>
						<Select.Root type="single" name="sort" bind:value={$selectedSort}>
							<Select.Trigger
								class="shadow-xs w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-left font-semibold"
							>
								{$triggerContent}
							</Select.Trigger>

							<Select.Content
								class="z-50 mt-1 max-h-[300px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
							>
								<Select.Group>
									{#each sort_hotels as option}
										<Select.Item
											value={option.value}
											class="cursor-pointer px-4 py-2 hover:bg-gray-100"
										>
											<div class="flex w-full items-start justify-between gap-4 px-4">
												<div class="text-sm font-semibold text-gray-800">{option.label}</div>
											</div>
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="mb-3 w-full px-10">
					<CarouselPrice />
				</div>
			</div>
			<div class="w-full space-y-2">
				{#each filteredHotels as hotel}
					<CardHotel {hotel} />
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="table">
			<div class="flex w-full flex-wrap items-start justify-between gap-3">
				<div>
					<div class="text-md">
						<span class="font-semibold text-blue-600">{hotel_result.length}</span>
						<span class="font-semibold text-neutral-600">Hotels Found</span>
					</div>
					<div class="text-md font-semibold">{state.searchModel.destination}</div>
				</div>

				<div class="flex items-end justify-end gap-2">
					<Tabs.List>
						<Tabs.Trigger value="list"
							><Icon
								icon="ic:sharp-list"
								width="24"
								height="24"
								style="color: #6f6f6f"
							/></Tabs.Trigger
						>
						<Tabs.Trigger value="table"
							><Icon
								icon="fluent:table-20-regular"
								width="20"
								height="20"
								style="color: #6f6f6f"
							/></Tabs.Trigger
						>
					</Tabs.List>
					<div class="flex items-center gap-2">
						<ShareHotels
							hotels={sharehotels}
							location={state.searchModel.destination}
							checkInDate={state.searchModel.date?.start}
							checkOutDate={state.searchModel.date?.start}
							guests={state.searchModel.guest}
							rooms={state.searchModel.room}
						/>
					</div>

					<!-- Sort -->
					<div>
						<Select.Root type="single" name="sort" bind:value={$selectedSort}>
							<Select.Trigger
								class="shadow-xs w-56 rounded-md border border-gray-300 bg-white px-3 py-2 text-left font-semibold"
							>
								{$triggerContent}
							</Select.Trigger>

							<Select.Content
								class="z-50 mt-1 max-h-[300px] overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
							>
								<Select.Group>
									{#each sort_hotels as option}
										<Select.Item
											value={option.value}
											class="cursor-pointer px-4 py-2 hover:bg-gray-100"
										>
											<div class="flex w-full items-start justify-between gap-4">
												<div class="text-sm font-semibold text-gray-800">{option.label}</div>
											</div>
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
				</div>
				<div class="mb-3 w-full px-10">
					<CarouselPrice />
				</div>
				<div class="w-full space-y-2">
					<Card.Root>
						<Card.Content>
							<TableHotel />
						</Card.Content>
					</Card.Root>
				</div>
			</div>
		</Tabs.Content>
	</Tabs.Root>
</section>
