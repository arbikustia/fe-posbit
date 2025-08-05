<script lang="ts">
	import { cn } from '$lib/utils';
	import type {
		SeatColumn,
		SeatMapSegment,
		SeatRow
	} from '$lib/types/api/flight/ancillary/SeatMap';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Accordion } from 'bits-ui';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { Close } from '$lib/components/icons';
	import { z } from 'zod';
	import type { seatSchema } from '../page/schema';
	import { useSeatSelect } from './seat-select.svelte.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { slide } from 'svelte/transition';

	type SeatSelectProps = {
		seatMapSegemnt: SeatMapSegment;
		onSeatSelect: (seat: SeatColumn) => void;
		selectedSeats: z.infer<typeof seatSchema>[];
	};

	let { seatMapSegemnt, onSeatSelect, selectedSeats }: SeatSelectProps = $props();

	const {
		getUniqueSeatTypeMap,
		getSeatTypes,
		getSeatColor,
		handleSeatClick,
		getRegularRow,
		getColumnHeaders,
		normalizeColumns
	} = useSeatSelect();

	let accordionValue = $state('');
	const uniqueSeatTypeMap = $derived(getUniqueSeatTypeMap(seatMapSegemnt));
	const seatTypes = $derived(getSeatTypes(uniqueSeatTypeMap));
	const regularRow = $derived(getRegularRow(seatMapSegemnt));
	const columnHeaders = $derived(getColumnHeaders(regularRow));
</script>

<Tooltip.Provider>
	<div class="relative h-full w-full overflow-y-auto overflow-x-hidden pb-52">
		<!-- Price Legend -->
		{#if seatTypes.length}
			<Accordion.Root type="single" bind:value={accordionValue}>
				<Accordion.Item class="border-y border-gray-400 bg-gray-300 p-4">
					<Accordion.Header class="flex items-center justify-between">
						<p class="font-semibold">Seat Price Information</p>
						<Accordion.Trigger
							class={buttonVariants({ variant: 'link', class: 'h-fit p-0 hover:no-underline' })}
						>
							See {accordionValue !== '' ? 'Less' : 'Details'}
						</Accordion.Trigger>
					</Accordion.Header>

					<Accordion.Content>
						{#snippet child({ props, open })}
							{#if open}
								<div class="grid grid-cols-2 gap-2 p-2" transition:slide>
									{#each seatTypes as { price, seatName, currency, color }}
										<div class="flex items-center gap-x-2">
											<div class="h-4 w-4 rounded-md" style="background-color: {color};"></div>
											<div>+ {formatThousand(price)} {currency}</div>
										</div>
									{/each}
								</div>
							{/if}
						{/snippet}
					</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		{/if}

		<div class="w-full overflow-x-auto">
			<!-- Seat Map -->
			<div class="min-w-fit p-4">
				<!-- Column Headers -->
				<div class="sticky top-0 mb-4 flex items-center bg-gray-200 py-2">
					<div class="mr-4 w-12"></div>
					<!-- Spacer for row numbers -->
					<div class="flex space-x-1">
						{#each columnHeaders as header}
							<div class="w-8 text-center font-semibold">
								{header}
							</div>
						{/each}
					</div>
				</div>
				<!-- Seat Grid -->
				<div>
					{#each seatMapSegemnt.Rows as row, rowIdx}
						{@const isFirstRow = rowIdx === 0}
						{@const isLastRow = rowIdx === seatMapSegemnt.Rows.length - 1}
						<div class="flex items-center">
							<!-- Row number -->
							<div
								class={cn('mr-4 w-8 text-right font-semibold', {
									'pt-4': isFirstRow,
									'pb-4': isLastRow
								})}
							>
								{row.Number}
							</div>

							<!-- Seats and aisles -->
							<div
								class={cn('flex space-x-1 border-none bg-card px-4 py-1', {
									'rounded-t-md pt-4': isFirstRow,
									'rounded-b-md pb-4': isLastRow
								})}
								style="backface-visibility: hidden;"
							>
								{#each normalizeColumns(row.columns, regularRow) as col}
									{@const selectedSeat = selectedSeats.find(
										(item) => item.seatId === col?.SeatCode
									)}
									{#if !col}
										<div class="h-8 w-8 rounded-md bg-gray-200"></div>
									{:else if !col.IsSeat}
										<div class="h-8 w-8 rounded-md bg-transparent"></div>
									{:else}
										<Tooltip.Root delayDuration={0}>
											<Tooltip.Trigger
												class={cn(
													'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
													selectedSeat?.seatId === col?.SeatCode ? 'ring-2 ring-yellow-400' : ''
												)}
												style="background-color: {getSeatColor(col, uniqueSeatTypeMap)};"
												disabled={!col.IsAvailable}
												onclick={() => handleSeatClick(col, selectedSeats, onSeatSelect)}
											>
												{#if !col.IsAvailable}
													<Close class="text-white" />
												{/if}
												{#if selectedSeat}
													<div
														class="flex h-4 w-4 items-center justify-center rounded-sm bg-red-500 text-xs text-white"
													>
														{selectedSeat.passengerIdx + 1}
													</div>
												{/if}
											</Tooltip.Trigger>
											{#if col.IsAvailable}
												<Tooltip.Content>
													<div class="text-center">
														<p class="font-semibold">{col.SeatNumber}</p>
														<p>{formatThousand(col.PriceAdult ?? 0)} {col.Currency}</p>
														<p>{col.SeatName}</p>
													</div>
												</Tooltip.Content>
											{/if}
										</Tooltip.Root>
									{/if}
								{/each}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</Tooltip.Provider>
