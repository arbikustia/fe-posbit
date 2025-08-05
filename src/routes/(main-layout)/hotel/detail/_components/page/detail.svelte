<script lang="ts">
	import { useFlightService } from '$lib/hooks/use-flight-service.svelte.js';
	import { useFlightSearchPage } from '../../../../flight/search/_components/page/flight-search-page.svelte.js';
	import { SearchHotelPanel } from '../../../_components/search-hotel-panel';
	import { HeaderDetailHotel } from '../header';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DetailRoomList from '../header/detail-room-list.svelte';
	import { TabLocation } from '../../../_components/card-hotel/tabs-card-hotel/index.js';
	import About from '../header/about.svelte';
	import { ScrollToTop } from '../scroll-to-top/index.js';
	import { ImageGallery } from '../image-gallery/index.js';
	import Facilities from '../header/facilities.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';

	const { getSchedule } = useFlightService();

	const {
		state: pageState,
		handleFlightSelect,
		onClearFilter,
		scheduleResults,
		progressPercent,
		setSelectedFlightSearchParams
	} = useFlightSearchPage();
	function scrollToSection(id: string, offset: number = -100) {
		const element = document.getElementById(id);
		if (element) {
			const y = element.getBoundingClientRect().top + window.scrollY + offset;
			window.scrollTo({ top: y, behavior: 'smooth' });
		}
	}

	const tabs = [
		{ label: 'About', id: 'about' },
		{ label: 'Rooms', id: 'rooms' },
		{ label: 'Locations', id: 'location' },
		{ label: 'Facilities', id: 'facilities' },
		{ label: 'Policies', id: 'policies' },
		{ label: 'Reviews', id: 'reviews' }
	];

	const reviews = [
		{
			name: 'AAA',
			date: '1 week ago',
			rating: 4,
			review:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
		},
		{
			name: 'AAA',
			date: '1 week ago',
			rating: 4,
			review:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
		},
		{
			name: 'AAA',
			date: '1 week ago',
			rating: 4,
			review:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
		},
		{
			name: 'AAA',
			date: '1 week ago',
			rating: 4,
			review:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
		}
	];
</script>

<section class="space-y-5">
	<SearchHotelPanel
		variant={'sticky'}
		isLoading={$progressPercent.isLoading}
		onSubmitCallback={() => {
			pageState.currentScheduleIdx = 0;
			getSchedule();
		}}
	/>
	<div class="container sticky top-32 z-10 px-4 py-0">
		<div class="flex gap-4 rounded-md border-b border-gray-300 bg-white px-2 py-1 shadow-md">
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
	</div>
	<div class="container space-y-5 pt-0">
		<Breadcrumb.Root class="">
			<Breadcrumb.List>
				<Breadcrumb.Item>
					<Breadcrumb.Link href="/">Hotel</Breadcrumb.Link>
				</Breadcrumb.Item>
				<Breadcrumb.Separator />
				<Breadcrumb.Item>
					<Breadcrumb.Page>Detail Hotel</Breadcrumb.Page>
				</Breadcrumb.Item>
			</Breadcrumb.List>
		</Breadcrumb.Root>

		<div id="about">
			<About />
		</div>
		<div id="rooms">
			<DetailRoomList />
		</div>
		<div id="location">
			<TabLocation />
		</div>
		<div id="facilities">
			<Facilities />
		</div>

		<Card.Root>
			<Card.Content>
				<div id="policies" class="mx-auto w-full">
					<h2 class="mb-8 text-center text-3xl font-bold text-gray-500">Policy</h2>
					<div class="mb-6">
						<h3 class="text-md mb-1 text-xl font-semibold">Check-in & Check-out Time</h3>
						<p class="text-justify text-sm leading-relaxed">
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
							has been the industry's standard dummy text ever since the 1500s, when an unknown
							printer took a galley of type and scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap into electronic typesetting,
							remaining essentially unchanged. It was popularised in the 1960s with the release of
							Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
							publishing software like Aldus PageMaker including versions of Lorem Ipsum.
						</p>
					</div>

					<div>
						<h3 class="text-md mb-1 text-xl font-semibold">Cancellation Policy</h3>
						<p class="text-justify text-sm leading-relaxed">
							Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
							has been the industry's standard dummy text ever since the 1500s, when an unknown
							printer took a galley of type and scrambled it to make a type specimen book. It has
							survived not only five centuries, but also the leap into electronic typesetting,
							remaining essentially unchanged. It was popularised in the 1960s with the release of
							Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
							publishing software like Aldus PageMaker including versions of Lorem Ipsum.
						</p>
					</div>
				</div>
			</Card.Content>
		</Card.Root>

		<div id="reviews" class="mx-auto max-w-7xl py-3">
			<!-- Header -->
			<div class="mb-8 flex items-center space-x-4">
				<div
					class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white"
				>
					4/5
				</div>
				<h2 class="text-3xl font-bold text-gray-500">Review Rating</h2>
			</div>

			<!-- Grid Review Cards -->
			<div class="grid grid-cols-1 gap-3 md:grid-cols-2">
				{#each reviews as review}
					<Card.Root>
						<Card.Content>
							<div>
								<div class="mb-2 flex items-center justify-between">
									<h3 class="font-bold">{review.name}</h3>
									<span class="text-sm text-gray-500">{review.date}</span>
								</div>

								<!-- Stars -->
								<div class="mb-3 flex space-x-1 text-gray-500">
									{#each Array(5) as _, i}
										<span>
											{#if i < review.rating}
												<Icon icon="ic:round-star" width="20" height="20" style="color: #f4cc4a" />
											{/if}
										</span>
									{/each}
								</div>

								<!-- Content -->
								<p class="text-justify text-sm leading-relaxed text-gray-700">
									{review.review}
								</p>
							</div>
						</Card.Content>
					</Card.Root>
				{/each}
			</div>
		</div>
	</div>
</section>
