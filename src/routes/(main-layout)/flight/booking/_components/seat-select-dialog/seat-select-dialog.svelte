<script lang="ts">
	import { Flight } from '$lib/components/icons';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { getPassengerFullName } from '../page/helpers';
	import { useSeatSelectDialog } from './seat-select-dialog.svelte.js';
	import SeatSelect from './seat-select.svelte';
	import type { SeatSelectDialogProps } from './types';
	import { ancillaryIconUrl } from '$lib/constants/app';

	let { form, open = $bindable(), isMultiCity }: SeatSelectDialogProps = $props();

	const { form: formData } = form;

	const {
		state,
		getSegmentOptions,
		getPassengers,
		getSelectedSeats,
		getTotalPriceSelectedSeat,
		onSeatSelect,
		getSelectedPassengerSeat,
		resetSeatSelection
	} = useSeatSelectDialog(formData);

	const segmentOptions = $derived(getSegmentOptions());

	const passengers = $derived(getPassengers());

	const selectedSeats = $derived(getSelectedSeats());

	const totalPriceSelectedSeat = $derived(getTotalPriceSelectedSeat());
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-0 p-0 lg:max-w-5xl">
		<Dialog.Header class="border-b p-4">
			<Dialog.Title>
				<div class="grid grid-cols-12">
					<div class="col-span-4 flex items-center gap-x-3">
						<img class="h-6" src={ancillaryIconUrl.seat} alt="Seat Icon" />
						Seat Selection
					</div>
					<div class="col-span-8">
						<div class="flex items-center justify-center gap-x-2">
							{#each segmentOptions as seatSegmentOptions}
								<div class="flex w-fit">
									{#each seatSegmentOptions as seatSegment, i}
										{@const isFirst = i === 0}
										{@const isLast = i === seatSegmentOptions.length - 1}
										{@const isSelected =
											seatSegment.TripIndex === state.selectedSegment?.TripIndex &&
											seatSegment.SegmentIndex === state.selectedSegment.SegmentIndex}
										<button
											class={cn(
												'border border-gray-200 px-2 py-1 text-center text-sm transition-colors duration-200',
												{
													'rounded-l-md': isFirst,
													'rounded-r-md': isLast,
													'border-primary bg-primary/5': isSelected
												}
											)}
											onclick={() => {
												state.selectedSegment = seatSegment;
												state.selectedPassengerIdx = 0;
											}}
										>
											{seatSegment.Origin} - {seatSegment.Destination}
										</button>
									{/each}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</Dialog.Title>
		</Dialog.Header>
		<div class="grid min-h-52 grid-cols-12 bg-gray-200">
			<div class="col-span-4 h-fit bg-white shadow-md">
				<div class="p-4">
					{#if isMultiCity}
						<Badge variant="secondary" class="items-start gap-x-1">
							<span class="leading-none">Flight {(state.selectedSegment?.TripIndex ?? 0) + 1}</span>
						</Badge>
					{:else}
						<Badge variant="secondary" class="items-center gap-x-2">
							<Flight
								class={cn('h-4 w-4', {
									'rotate-45': state.selectedSegment?.TripIndex === 0,
									'-rotate-135': state.selectedSegment?.TripIndex === 1
								})}
							/>
							<span class="leading-none"
								>{state.selectedSegment?.TripIndex === 0 ? 'Departure' : 'Return'}</span
							>
						</Badge>
					{/if}
					<div class="flex justify-between">
						<div class="flex items-center font-semibold">
							<p>{state.selectedSegment?.Origin}</p>
							<Icon icon="mdi-light:arrow-right" />
							<p>{state.selectedSegment?.Destination}</p>
						</div>
						<img
							class="h-10 w-10 object-contain"
							src={state.selectedSegment?.OperatingImage}
							alt="Airplane"
						/>
					</div>
					<div class="flex justify-between text-sm text-gray-500">
						<p>{state.selectedSegment?.DepartureDate} {state.selectedSegment?.DepartureTime}</p>

						<p>{state.selectedSegment?.Aircraft}</p>
					</div>
				</div>
				<Separator />
				{#each passengers as passenger, passengerIdx}
					{@const selectedSeat = getSelectedPassengerSeat(passengerIdx)}
					<Button
						variant="ghost"
						class={cn(
							'relative flex h-fit w-full items-start justify-start gap-x-2 rounded-none px-4 text-start',
							{
								'bg-primary/10!': state.selectedPassengerIdx === passengerIdx,
								'text-primary!': state.selectedPassengerIdx === passengerIdx
							}
						)}
						onclick={() => (state.selectedPassengerIdx = passengerIdx)}
					>
						{passengerIdx + 1}.
						<div class="flex-1 space-y-2">
							<p>{getPassengerFullName(passenger)}</p>
							<p class="text-gray-500">Pick Seat</p>
							<div class="flex justify-between">
								<div class="text-gray-500">{selectedSeat?.seatNumber}</div>
								<div class="text-gray-500">
									{selectedSeat?.seatPrice ? formatThousand(selectedSeat.seatPrice) : ''}
									{selectedSeat?.seatCurrencyCode}
								</div>
							</div>
						</div>
						{#if state.selectedPassengerIdx === passengerIdx}
							<span class="bg-primary absolute bottom-0 left-0 top-0 w-1 rounded-r-md"></span>
						{/if}
					</Button>
					<Separator />
				{/each}
			</div>
			<div class="custom-scrollbar col-span-8 max-h-[70vh] overflow-auto">
				<div>
					{#if state.selectedSegment}
						<SeatSelect seatMapSegemnt={state.selectedSegment} {onSeatSelect} {selectedSeats} />
					{/if}
				</div>
			</div>
		</div>
		<Dialog.Footer class="grid grid-cols-12 p-4">
			<div class="col-span-4">
				<div class="flex justify-between text-lg font-semibold">
					<p>Subtotal</p>
					<p class="text-primary">{totalPriceSelectedSeat}</p>
				</div>
				<div class="text-sm text-gray-500">All selected seats</div>
			</div>
			<div class="col-span-8 flex items-center justify-end gap-x-2">
				<Button variant="ghost" onclick={resetSeatSelection}>Reset</Button>
				<Button
					onclick={() => {
						open = false;
					}}>Done</Button
				>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
