<script lang="ts">
	import { OSGPrefixedInput } from '$lib/components/opsigo-ui/prefixed-input';
	import { OSGPresetDatePicker } from '$lib/components/opsigo-ui/preset-date-picker';
	import { Button } from '$lib/components/ui/button';
	import * as Pagination from '$lib/components/ui/pagination';
	import { ChevronLeftIcon, ChevronRightIcon, Search } from '@lucide/svelte';
	import type { DateRange } from 'bits-ui';
	import { AdvancedFilter } from '../advanced-filter';
	import { BookingItem } from '../booking-item';
	import type { BookingType } from '../booking-item/booking-item.svelte';
	import { FilterCategory } from '../filter-category';
	import { FilterStatus } from '../filter-status';

	const bookings = [
		{
			name: 'Garuda Indonesia',
			logo: 'https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/GA-mail.png',
			type: 'flight'
		},
		{
			name: 'TMTP Insurance - ASEAN (Individual)',
			logo: 'https://portalvhds11000v9mfhk0k.blob.core.windows.net/travel/zurichlogo.png',
			type: 'insurance'
		},
		{
			name: 'Hampton by Hilton Berlin City Centre Alexanderplatz',
			type: 'hotel'
		},
		{
			name: 'Kereta Api Indonesia',
			logo: 'https://portalvhds11000v9mfhk0k.blob.core.windows.net/travel/kai.png',
			type: 'train'
		}
	];

	let dateFilterValue = $state<DateRange>({
		start: undefined,
		end: undefined
	});
</script>

<div class="container">
	<h1 class="mb-11 text-2xl font-semibold">Manage Booking</h1>
	<div class="flex flex-col gap-y-4">
		<div class="mb-16 flex items-center justify-between">
			<FilterCategory />

			<div class="flex items-center gap-2">
				<FilterStatus />
				<div>
					<p class="mb-1 text-sm font-semibold">Created Date</p>
					<OSGPresetDatePicker bind:value={dateFilterValue} />
				</div>
				<div class="self-end">
					<AdvancedFilter />
				</div>
				<Button class="text-primary! self-end border" variant="ghost">Reset</Button>
			</div>
		</div>

		<div class="flex items-center justify-between">
			<p class="text-muted-foreground font-medium">Showing 60 Bookings</p>
			<OSGPrefixedInput placeholder="Search" prefixWrapperClass="bg-white" class="max-w-90">
				{#snippet inputPrefix()}
					<Search />
				{/snippet}
			</OSGPrefixedInput>
		</div>
		<div class="space-y-8">
			{#each bookings as booking}
				<BookingItem
					type={booking.type as BookingType}
					status="reserved"
					providerName={booking.name}
					providerImage={booking.logo}
				/>
			{/each}
		</div>

		<div class="flex items-center justify-between">
			<p class="text-muted-foreground">Show 1-25 of 60</p>
			<Pagination.Root count={20} perPage={3} siblingCount={1} class="mx-0 w-fit flex-none">
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton>
								<ChevronLeftIcon class="size-4" />
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton>
								<ChevronRightIcon class="size-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</div>
	</div>
</div>
