<script lang="ts">
	import Icon from '@iconify/svelte';
	import { TabAbout, TabRoom, TabImage, TabLocation, TabPolicies } from './tabs-card-hotel';
	import { goto } from '$app/navigation';
	import TabFacilities from './tabs-card-hotel/tab-facilities.svelte';
	import TabReviews from './tabs-card-hotel/tab-reviews.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	export let hotel;

	let cardOpened = false;
	let activeTab:
		| string
		| 'Room'
		| 'About'
		| 'Image'
		| 'Location'
		| 'Facilities'
		| 'Policies'
		| 'Reviews' = 'Room';
	let tabs = [
		{ label: 'Room', value: 'Room' },
		{ label: 'About', value: 'About' },
		{ label: 'Image', value: 'Image' },
		{ label: 'Location', value: 'Location' },
		{ label: 'Facilities', value: 'Facilities' },
		{ label: 'Policies', value: 'Policies' },
		{ label: 'Reviews', value: 'Reviews' }
	];
	let rooms = [
		{
			section: 'Available Room',
			items: [
				{
					type: 'Superior Room',
					breakfast: true,
					isTwinBed: true,
					refundable: false,
					price: 560000
				},
				{
					type: 'Deluxe Room',
					breakfast: false,
					isTwinBed: true,
					refundable: true,
					price: 623000
				}
			]
		},
		{
			section: 'Available Room',
			items: [
				{
					type: 'Superior Room',
					breakfast: true,
					isTwinBed: true,
					refundable: false,
					price: 560000
				},
				{
					type: 'Deluxe Room',
					breakfast: false,
					isTwinBed: true,
					refundable: true,
					price: 623000
				}
			]
		}
	];

	function NavigateToDetail() {
		goto('/hotel/detail');
	}
</script>

<!-- Card Hotel -->
<Card.Root>
	<Card.Content class="h-full overflow-y-auto">
		<Button onclick={NavigateToDetail} class="w-full sticky top-0 cursor-pointer transition">
			<div class="flex w-full items-start justify-between">
				<div class="flex justify-center gap-5">
					<img
						alt=""
						class="w-44"
						src="https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain"
					/>
					<div class="flex flex-col justify-between">
						<div class="text-start">
							<h2 class="text-xl font-semibold text-blue-800">{hotel.name}</h2>
							<p class="flex text-xs text-yellow-300">
								{#each Array(hotel.rating) as _, i}
									<Icon icon="material-symbols:star-rounded" width="20" height="20" />
								{/each}
							</p>
							<p class="text-md flex items-end gap-2 text-gray-600">
								<Icon icon="mynaui:location" width="20" height="20" />
								<span>{hotel.location}</span>
							</p>
						</div>
						<div class="space-y-1 text-start">
							<p class="text-md">Review Rating: {hotel.rating}/5</p>
							<p class="flex gap-1 text-sm text-gray-600">
								<Icon icon="material-symbols:wifi-rounded" width="16" height="16" />
								<Icon icon="fe:car" width="16" height="16" />
								<Icon icon="mdi-light:cart" width="16" height="16" />
								<Icon icon="fluent-mdl2:eat-drink" width="16" height="16" />
							</p>
						</div>
					</div>
				</div>
				<div class="flex h-32 flex-col items-end justify-between">
					<div class="text-right">
						<p class="text-xl font-bold text-red-600">IDR {hotel.price.toLocaleString()}</p>
						<p class="text-xs text-gray-500">per room per night<br />(includes taxes & fees)</p>
					</div>
					<div class="flex flex-col items-end gap-1">
						<p class="text-sm font-bold text-gray-500">10 Rooms Types Available</p>
						<Button
							onclick={(e) => {
								e.stopPropagation();
								cardOpened = !cardOpened;
							}}
							class="h-8 w-24  rounded-md text-center text-xs text-white"
						>
							{cardOpened ? 'Hide' : 'View'} Rooms
						</Button>
					</div>
				</div>
			</div>

			{#if cardOpened}
				<!-- Tab menu -->
				<div class="mt-4 flex w-3/4 justify-around border-b pt-2 text-sm">
					{#each tabs as tab}
						<Button
							variant="link"
							onclick={(e) => {
								e.stopPropagation(), (activeTab = tab.value);
							}}
							class="flex-1 py-2 text-black"
						>
							{tab.value}
						</Button>
					{/each}
				</div>
			{/if}
		</Button>

		{#if cardOpened}
			<div class="shadow-xs mx-auto mt-4 w-fullp-2">
				{#if activeTab === 'Room'}
					<TabRoom {rooms} />
				{:else if activeTab === 'About'}
					<TabAbout {hotel} />
				{:else if activeTab === 'Image'}
					<TabImage />
				{:else if activeTab === 'Location'}
					<TabLocation />
				{:else if activeTab === 'Facilities'}
					<TabFacilities />
				{:else if activeTab === 'Policies'}
					<TabPolicies />
				{:else if activeTab === 'Reviews'}
					<TabReviews />
				{/if}
			</div>
		{/if}
	</Card.Content>
</Card.Root>
