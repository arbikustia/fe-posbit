<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Dialog from '$lib/components/ui/dialog';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import ChevronRight from '@lucide/svelte/icons/chevron-right';
	import type { AddMealDialogProps } from './types';
	import { ancillaryIconUrl } from '$lib/constants/app';
	import { useAddMealDialog } from './add-meal-dialog.svelte.js';
	import { getPassengerFullName } from '../page/helpers';
	import { displayTime, formatTimeSpan } from '$lib/helpers/date-helper';
	import { fly } from 'svelte/transition';

	let { form, open = $bindable(), trips }: AddMealDialogProps = $props();

	const { form: formData } = form;

	const {
		state,
		groupSegmentsByTrip,
		getPassengers,
		getTotalPriceSelectedMeal,
		getCurrentTripSegment,
		onMealSelect,
		getSelectedPassengerMeals,
		resetMealSelection
	} = useAddMealDialog(formData);

	const segmentsByTrips = $derived(groupSegmentsByTrip());
	const passengers = $derived(getPassengers());
	const currentTripSegment = $derived(getCurrentTripSegment(trips));
	const totalPriceSelectedMeal = $derived(getTotalPriceSelectedMeal());
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-0 p-0 lg:max-w-4xl">
		<Dialog.Header class="z-10 rounded-t-md border-b bg-white p-4">
			<Dialog.Title>
				<div class="grid grid-cols-12">
					<div class="col-span-4 flex items-center gap-x-3">
						<img class="h-6" src={ancillaryIconUrl.meal} alt="Meal Icon" />
						Meals
					</div>
					<div class="col-span-8">
						<div class="flex items-center justify-center gap-x-2">
							{#each segmentsByTrips as segmentsByTrip}
								<div class="flex w-fit">
									{#each segmentsByTrip as segment, i}
										{@const isFirst = i === 0}
										{@const isLast = i === segmentsByTrip.length - 1}
										{@const isSelected =
											segment.TripIndex === state.selectedSegment?.TripIndex &&
											segment.SegmentIndex === state.selectedSegment.SegmentIndex}
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
												state.selectedSegment = segment;
												state.selectedPassengerIdx = 0;
											}}
										>
											{segment.Origin} - {segment.Destination}
										</button>
									{/each}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</Dialog.Title>
		</Dialog.Header>
		<div class="grid min-h-52 grid-cols-12 bg-gray-100">
			<div class="col-span-4 h-full border-r bg-white">
				{#if currentTripSegment}
					<div class="space-y-2 p-4">
						<img class="h-10" src={currentTripSegment.marketingCarrier.image} alt="Airplane" />
						<div class="w-full">
							<div class="flex items-center justify-center">
								<div class="flex items-center gap-1">
									<div class="w-[90px] text-center leading-none">
										<div class="text-lg font-medium">
											{displayTime(currentTripSegment.departureDateTime)}
										</div>
										<div class="text-muted-foreground">
											{currentTripSegment.origin.airport.code}
										</div>
									</div>

									<div class="flex w-[100px] items-center justify-center gap-2 text-center">
										<div class="border-muted-foreground w-3 border-b border-dashed"></div>
										<div class="text-muted-foreground text-sm">
											<div class="whitespace-nowrap">
												{formatTimeSpan(currentTripSegment.flightTime)}
											</div>
										</div>

										<div class="border-muted-foreground w-3 border-b border-dashed"></div>
									</div>

									<div class="w-[90px] text-center leading-none">
										<div class="text-lg font-medium">
											{displayTime(currentTripSegment.arrivalDateTime)}
										</div>
										<div class="text-muted-foreground">
											{currentTripSegment.destination.airport.code}
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
				<Separator />
				{#each passengers as passenger, passengerIdx}
					{@const isSelected = state.selectedPassengerIdx === passengerIdx}
					{@const selectedPassengerMeals = getSelectedPassengerMeals(passengerIdx)}
					<Button
						variant="ghost"
						class={cn(
							'relative flex h-fit w-full items-start justify-start gap-x-2 rounded-none px-4 text-start',
							{
								'bg-primary/10! text-primary!': isSelected
							}
						)}
						onclick={() => (state.selectedPassengerIdx = passengerIdx)}
					>
						{passengerIdx + 1}.
						<div class="flex-1 space-y-2">
							<div class="flex items-center justify-between">
								<p>{getPassengerFullName(passenger)}</p>
								<ChevronRight class="h-5! w-5! text-gray-400" />
							</div>
							{#each selectedPassengerMeals as selectedPassengerMeal}
								<div class="flex justify-between gap-x-4 font-normal">
									<p class="text-wrap text-gray-500">{selectedPassengerMeal.mealName}</p>
									<div class="text-gray-500">
										{formatThousand(selectedPassengerMeal.mealPrice)}
										{selectedPassengerMeal.mealCurrencyCode}
									</div>
								</div>
							{/each}
						</div>
						{#if isSelected}
							<span class="bg-primary absolute bottom-0 left-0 top-0 w-1 rounded-r-md"></span>
						{/if}
					</Button>
					<Separator />
				{/each}
			</div>
			<div class="relative col-span-8">
				{#if state.showLimitError}
					<div transition:fly={{ y: -50 }} class="absolute top-0 w-full p-4 pr-6 pt-1">
						<div class="w-full rounded-md bg-red-500 p-2 text-white">
							Sorry, you can only choose 3 meal(s)/pax.
						</div>
					</div>
				{/if}
				<div class="custom-scrollbar max-h-[50vh] overflow-auto p-4">
					<Badge class="bg-white! shadow-xs  mb-4 w-full space-x-2 rounded-sm text-gray-700">
						<Icon icon="material-symbols:warning" class="text-orange-400" width={18} height={18} />
						<p>Max selection 3 meals</p>
					</Badge>
					<div class="flex flex-col gap-y-2">
						{#each state.selectedSegment.Items as mealItem}
							{@const selected = getSelectedPassengerMeals(state.selectedPassengerIdx)
								.map((item) => item.mealId)
								.includes(mealItem.Code)}
							<Button
								variant="outline"
								role="checkbox"
								aria-checked={selected}
								class={cn(
									'shadow-xs focus-visible:outline-hidden h-fit items-start justify-between p-4',
									{
										'ring-primary ring-2': selected
									}
								)}
								onclick={() => {
									onMealSelect(mealItem);
								}}
							>
								<div class="flex gap-x-2 text-left">
									<Checkbox bind:checked={() => selected, (_) => {}} />
									<div class="flex flex-col gap-y-1">
										<p class="text-lg font-semibold leading-none">{mealItem.Name}</p>
										<p class="text-sm font-normal text-gray-500">
											{formatThousand(mealItem.Price)}
											{mealItem.CurrencyCode}/pax
										</p>
									</div>
								</div>
								<img src={mealItem.Image} class="h-full w-20 rounded-sm object-cover" alt="meal" />
							</Button>
						{/each}
					</div>
				</div>
			</div>
		</div>
		<Dialog.Footer class="grid grid-cols-12 border-t p-4">
			<div class="col-span-4">
				{#if totalPriceSelectedMeal !== ''}
					<div class="flex justify-between text-lg font-semibold">
						<p>Subtotal</p>
						<p class="text-primary">{totalPriceSelectedMeal}</p>
					</div>
					<div class="text-sm text-gray-500">(All flight and pax)</div>
				{/if}
			</div>
			<div class="col-span-8 flex items-center justify-end gap-x-2">
				<Button variant="ghost" onclick={resetMealSelection}>Reset</Button>
				<Button
					onclick={() => {
						open = false;
					}}>Done</Button
				>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
