<script lang="ts">
	import { Reset } from '$lib/components/icons';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils';
	import { ArrowLeft, ArrowRight, ChevronUp } from '@lucide/svelte';
	import dayjs from 'dayjs';
	import { getPassengerFullName } from '../page/helpers';
	import MSeatSelect from './m-seat-select.svelte';
	import { useSeatSelectDialog } from './seat-select-dialog.svelte.js';
	import type { SeatSelectDialogProps } from './types';
	import { formatThousand } from '$lib/helpers/number-helper';
	import type { SeatMapSegment } from '$lib/types/api/flight/ancillary/SeatMap';
	import { Separator } from '$lib/components/ui/separator';
	import { ancillaryIconUrl } from '$lib/constants/app';

	let { form, open = $bindable(), isMultiCity }: SeatSelectDialogProps = $props();

	const { form: formData } = form;

	const {
		state: cState,
		getSegmentOptions,
		getPassengers,
		getSelectedSeats,
		getTotalPriceSelectedSeat,
		onSeatSelect,
		getSelectedPassengerSeat,
		resetSeatSelection
	} = useSeatSelectDialog(formData);

	let isOpenSeatSelection = $state(false);
	let isOpenFareDetail = $state(false);

	const segmentOptions = $derived(getSegmentOptions());

	const passengers = $derived(getPassengers());

	const selectedSeats = $derived(getSelectedSeats());

	const totalPriceSelectedSeat = $derived(getTotalPriceSelectedSeat());

	const totalPriceSelectedSeatBySegment = $derived.by(() => {
		const selectedSeatsBySegment = getSelectedSeatsBySegment(cState.selectedSegment);
		const total = selectedSeatsBySegment.reduce((sum, item) => {
			return (sum += item.seatPrice);
		}, 0);

		return selectedSeatsBySegment.length > 0
			? `${formatThousand(total)} ${selectedSeatsBySegment[0].seatCurrencyCode}`
			: '';
	});

	function getSelectedSeatsBySegment(segment: SeatMapSegment) {
		return (
			$formData.ancillary.seats.filter(
				(item) => item.tripIndex === segment.TripIndex && item.segmentIndex === segment.SegmentIndex
			) ?? []
		);
	}
</script>

<Drawer.Root bind:open>
	<Drawer.Content
		class="border-none bg-gray-100 p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="static max-w-full bg-primary/85 text-primary-foreground">
			{#snippet leftAction()}
				<button
					onclick={() => {
						open = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="flex items-center gap-x-4 text-lg font-semibold">
					<img class="h-6" src={ancillaryIconUrl.seat} alt="Seat Icon" />
					Seat Selection
				</div>
			{/snippet}

			{#snippet rightContent()}
				<button onclick={resetSeatSelection}>
					<Reset />
				</button>
			{/snippet}
		</MOSGAppBar>
		<div class="p-4">
			<div class="space-y-4">
				{#each segmentOptions as seatSegmentOptions, seatSegmentOptionsIdx}
					<div class="space-y-2">
						{#if isMultiCity}
							<p class="text-lg font-semibold">
								Flight {seatSegmentOptionsIdx + 1}
							</p>
						{:else}
							<p class="text-lg font-semibold">
								{seatSegmentOptionsIdx === 0 ? 'Departure' : 'Return'}
							</p>
						{/if}
						{#each seatSegmentOptions as seatSegment}
							{@const seats = getSelectedSeatsBySegment(seatSegment)}
							{@const isAvailable = true}

							<div class="rounded-xl border border-gray-400 p-4">
								<div class="flex items-center justify-between">
									<div class="space-y-1">
										<div class="flex items-center gap-4">
											<div class="rounded-full border border-gray-400 p-2">
												<img
													class="h-8 w-8 object-contain"
													src={seatSegment.OperatingImage}
													alt="Airplane Logo"
												/>
											</div>
											<div>
												<p class="font-semibold">
													{seatSegment.Origin} - {seatSegment.Destination}
												</p>
												<p class="text-sm text-gray-500">
													{dayjs(seatSegment.DepartureDate).format('DD MMM')}, {seatSegment.DepartureTime}
													- {seatSegment.ArrivalTime} ∙ {seatSegment.Duration}
												</p>
											</div>
										</div>
									</div>
									{#if isAvailable}
										<Button
											variant="link"
											class="h-fit p-0 hover:no-underline"
											onclick={() => {
												cState.selectedSegment = seatSegment;
												cState.selectedPassengerIdx = 0;
												isOpenSeatSelection = true;
											}}>{seats.length > 0 ? 'Change' : 'Select'}</Button
										>
									{:else}
										<p class="text-sm text-gray-400">Not Available</p>
									{/if}
								</div>
								{#if seats.length > 0}
									<div class="my-4 w-full border-b-2 border-dashed border-gray-400"></div>
									{#each seats as seat}
										<div class="grid grid-cols-12 gap-2">
											<div class="col-span-5 truncate">
												{getPassengerFullName($formData.passengers[seat.passengerIdx])}
											</div>
											<div class="col-span-7 flex justify-between">
												<div>{seat.seatNumber}</div>
												<div class="text-right">
													{formatThousand(seat.seatPrice)}
													{seat.seatCurrencyCode}
												</div>
											</div>
										</div>
									{/each}
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			{#if totalPriceSelectedSeat !== ''}
				<div>
					<button class="flex items-center gap-x-1" onclick={() => (isOpenFareDetail = true)}>
						<p class="text-sm"><span class="font-semibold">Subtotal</span> (Seat Selection)</p>
						<ChevronUp class="h-5 w-5" />
					</button>
					<p class="font-semibold">
						{totalPriceSelectedSeat}
					</p>
				</div>
			{:else}
				<p class="text-sm text-gray-500"><span class="font-semibold">No Selected</span></p>
			{/if}

			<Button class="px-8" onclick={() => (open = false)}>Done</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>

<!-- Seat Selection Drawer -->
<Drawer.Root bind:open={isOpenSeatSelection}>
	<Drawer.Content
		class="border-none bg-gray-200 p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="static max-w-full bg-primary/85 text-primary-foreground">
			{#snippet leftAction()}
				<button
					onclick={() => {
						isOpenSeatSelection = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="flex items-center gap-x-4 text-lg font-semibold">
					<div class="item-center flex justify-center rounded-full bg-white p-2">
						<img
							class="h-5 w-5 object-contain"
							src={cState.selectedSegment.OperatingImage}
							alt="Airplane Logo"
						/>
					</div>
					<div>
						<div class="flex items-center gap-2">
							{cState.selectedSegment.Origin}
							<ArrowRight />
							{cState.selectedSegment.Destination}
						</div>
						<p class="text-sm font-normal">
							{dayjs(cState.selectedSegment.DepartureDate).format('ddd, DD MMM YY')}
						</p>
					</div>
				</div>
			{/snippet}
		</MOSGAppBar>
		<div>
			<div class="scrollbar-hide flex items-center gap-x-2 overflow-x-auto p-2">
				{#each passengers as passenger, passengerIdx}
					{@const isSelected = cState.selectedPassengerIdx === passengerIdx}
					{@const selectedPassengerSeat = getSelectedPassengerSeat(passengerIdx)}
					<button
						class={cn(
							'h-18 min-w-38 cursor-pointer space-y-1 rounded-md border border-gray-300 bg-white px-4 text-start',
							{
								'ring-2 ring-primary': isSelected
							}
						)}
						onclick={() => (cState.selectedPassengerIdx = passengerIdx)}
					>
						<div class="flex items-center gap-4">
							<div
								class={cn('text-lg font-semibold', {
									'text-primary': isSelected
								})}
							>
								{passengerIdx + 1}
							</div>
							<div>
								<p class="font-semibold">{getPassengerFullName(passenger)}</p>
								{#if selectedPassengerSeat}
									<p class="text-sm">{selectedPassengerSeat.seatNumber}</p>
									<p class="text-sm">
										+ {formatThousand(selectedPassengerSeat.seatPrice)}
										{selectedPassengerSeat.seatCurrencyCode}
									</p>
								{:else}
									<p class="text-sm">No Preference</p>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
		<div class="h-full">
			{#if cState.selectedSegment}
				<MSeatSelect seatMapSegemnt={cState.selectedSegment} {onSeatSelect} {selectedSeats} />
			{/if}
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			{#if totalPriceSelectedSeatBySegment !== ''}
				<div>
					<p class="text-sm">Subtotal</p>

					<p class="font-semibold">
						{totalPriceSelectedSeatBySegment}
					</p>
				</div>
			{:else}
				<p class="text-sm text-gray-500"><span class="font-semibold">No Selected</span></p>
			{/if}

			<Button class="px-8" onclick={() => (isOpenSeatSelection = false)}>Save</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>

<!-- Fare Detail -->
<Drawer.Root bind:open={isOpenFareDetail}>
	<Drawer.Content class="border-none p-0">
		<Drawer.Header>
			<Drawer.Title>Fare Detail</Drawer.Title>
		</Drawer.Header>

		<div class="space-y-4 px-4 pb-4">
			{#each cState.seatMapSegments as segment, i}
				{@const seats = getSelectedSeatsBySegment(segment)}
				{@const isLast = i === cState.seatMapSegments.length - 1}
				<div class="space-y-4">
					<p class="font-semibold">
						{segment.Origin} → {segment.Destination}
					</p>

					{#if seats.length > 0}
						{#each seats as seat}
							<div class="grid grid-cols-12 gap-2">
								<div class="col-span-5 truncate">
									{getPassengerFullName($formData.passengers[seat.passengerIdx])}
								</div>
								<div class="col-span-7 flex justify-between">
									<div>{seat.seatNumber}</div>
									<div class="text-right">
										{formatThousand(seat.seatPrice)}
										{seat.seatCurrencyCode}
									</div>
								</div>
							</div>
						{/each}
					{:else}
						<p class="text-gray-500">No Selected</p>
					{/if}

					{#if !isLast}
						<div class="w-full border-b-2 border-dashed border-gray-400"></div>
					{/if}
				</div>
			{/each}
		</div>
		<Separator />
		<div class="flex justify-between p-4 font-semibold">
			<div>Total</div>
			<div>{totalPriceSelectedSeat}</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
