<script lang="ts">
	import { Reset } from '$lib/components/icons';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils';
	import { ArrowLeft, ArrowRight, ChevronUp } from '@lucide/svelte';
	import dayjs from 'dayjs';
	import { getPassengerFullName } from '../page/helpers';
	import { formatThousand } from '$lib/helpers/number-helper';
	import type { SeatMapSegment } from '$lib/types/api/flight/ancillary/SeatMap';
	import { Separator } from '$lib/components/ui/separator';
	import type { AddMealDialogProps } from './types';
	import { ancillaryIconUrl } from '$lib/constants/app';
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import Icon from '@iconify/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { useAddMealDialog } from './add-meal-dialog.svelte.js';
	import { displayDate, displayTime, formatTimeSpan } from '$lib/helpers/date-helper';

	let { form, open = $bindable(), trips, isMultiCity }: AddMealDialogProps = $props();

	const { form: formData } = form;

	const {
		state: cState,
		groupSegmentsByTrip,
		getPassengers,
		getTotalPriceSelectedMeal,
		getCurrentTripSegment,
		onMealSelect,
		getSelectedPassengerMeals,
		getPassengerIdxsBySegment,
		resetMealSelection
	} = useAddMealDialog(formData);

	let isOpenMealSelection = $state(false);

	const segmentsByTrips = $derived(groupSegmentsByTrip());
	const passengers = $derived(getPassengers());
	const currentTripSegment = $derived(getCurrentTripSegment(trips));
	const totalPriceSelectedMeal = $derived(getTotalPriceSelectedMeal());

	const totalPriceSelectedMealBySegment = $derived.by(() => {
		const selectedMealsBySegment = $formData.ancillary.meals.filter(
			(item) =>
				item.tripIndex === cState.selectedSegment.TripIndex &&
				item.segmentIndex === cState.selectedSegment.SegmentIndex
		);
		const total = selectedMealsBySegment.reduce((sum, item) => {
			return (sum += item.mealPrice);
		}, 0);

		return selectedMealsBySegment.length > 0
			? `${formatThousand(total)} ${selectedMealsBySegment[0].mealCurrencyCode}`
			: '';
	});
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
					<img class="h-6" src={ancillaryIconUrl.meal} alt="Meal Icon" />
					Meals Selection
				</div>
			{/snippet}

			{#snippet rightContent()}
				<button onclick={resetMealSelection}>
					<Reset />
				</button>
			{/snippet}
		</MOSGAppBar>
		<div class="p-4">
			<div class="space-y-4">
				{#each segmentsByTrips as segmentsByTrip, tripIdx}
					{@const trip = trips[tripIdx]}
					{@const isAvailable = true}
					<div class="space-y-2">
						{#if isMultiCity}
							<p class="text-lg font-semibold">
								Flight {tripIdx + 1}
							</p>
						{:else}
							<p class="text-lg font-semibold">
								{tripIdx === 0 ? 'Departure' : 'Return'}
							</p>
						{/if}
						{#each segmentsByTrip as segment, segmentIdx}
							{@const tripSegment = trip.segments[segmentIdx]}
							{@const passengerIdxs = getPassengerIdxsBySegment(segment)}
							<div class="rounded-xl border border-gray-400 p-4">
								<div class="flex items-center justify-between">
									<div class="space-y-1">
										<div class="flex items-center gap-4">
											<div class="rounded-full border border-gray-400 p-2">
												<img
													class="h-8 w-8 object-contain"
													src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/JT-mail.png"
													alt="Airplane Logo"
												/>
											</div>
											<div>
												<p class="font-semibold">
													{tripSegment.origin.airport.code} → {tripSegment.destination.airport.code}
												</p>
												<p class="text-sm text-gray-500">
													{displayDate(tripSegment.departureDateTime, 'DD MMM')}, {displayTime(
														tripSegment.departureDateTime
													)} - {displayTime(tripSegment.arrivalDateTime)} ∙ {formatTimeSpan(
														tripSegment.flightTime
													)}
												</p>
											</div>
										</div>
									</div>
									{#if isAvailable}
										<Button
											variant="link"
											class="h-fit p-0 hover:no-underline"
											onclick={() => {
												isOpenMealSelection = true;
												cState.selectedSegment = segment;
											}}>{passengerIdxs.length > 0 ? 'Change' : 'Select'}</Button
										>
									{:else}
										<p class="text-sm text-gray-400">Not Available</p>
									{/if}
								</div>

								{#if passengerIdxs.length > 0}
									<OSGDashSeparator class="my-4" />
									<div class="space-y-2">
										{#each passengerIdxs as passengerIdx}
											{@const passengerMeals = $formData.ancillary.meals.filter(
												(item) =>
													item.passengerIdx === passengerIdx &&
													item.tripIndex === segment.TripIndex &&
													item.segmentIndex === segment.SegmentIndex
											)}
											<div class="space-y-1">
												<div class="font-semibold">
													{getPassengerFullName(passengers[passengerIdx])}
												</div>
												{#each passengerMeals as passengerMeal}
													<div
														class="flex flex-nowrap items-center justify-between gap-x-4 pl-4 text-sm text-gray-700"
													>
														<div class="line-clamp-1 flex flex-1 items-center gap-x-2">
															<div class="h-1 w-1 rounded-full bg-black"></div>
															{passengerMeal.mealName}
														</div>
														{#if passengerMeal.mealPrice > 0}
															<div>
																{formatThousand(passengerMeal.mealPrice)}
																{passengerMeal.mealCurrencyCode}
															</div>
														{:else}
															<div>Free</div>
														{/if}
													</div>
												{/each}
											</div>
										{/each}
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			{#if totalPriceSelectedMeal !== ''}
				<div>
					<p class="text-sm"><span class="font-semibold">Subtotal</span> (Meals)</p>

					<p class="font-semibold">
						{totalPriceSelectedMeal}
					</p>
				</div>
			{:else}
				<p class="text-sm text-gray-500"><span class="font-semibold">No Selected</span></p>
			{/if}

			<Button class="px-8" onclick={() => (open = false)}>Done</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>

<Drawer.Root bind:open={isOpenMealSelection}>
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
						isOpenMealSelection = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="flex items-center gap-x-4 text-lg font-semibold">
					{#if currentTripSegment}
						<div class="item-center flex justify-center rounded-full bg-white p-2">
							<img
								class="h-5 w-5 object-contain"
								src={currentTripSegment.marketingCarrier.image}
								alt="Airplane Logo"
							/>
						</div>
						<div>
							<div class="flex items-center gap-2">
								{currentTripSegment.origin.airport.code}
								<ArrowRight />
								{currentTripSegment.destination.airport.code}
							</div>
							<p class="text-sm font-normal">
								{displayDate(currentTripSegment.departureDateTime, 'DD MMM')}, {displayTime(
									currentTripSegment.departureDateTime
								)} - {displayTime(currentTripSegment.arrivalDateTime)} ∙ {formatTimeSpan(
									currentTripSegment.flightTime
								)}
							</p>
						</div>
					{/if}
				</div>
			{/snippet}
		</MOSGAppBar>
		<div>
			<div class="scrollbar-hide flex items-center gap-x-2 overflow-x-auto p-2">
				{#each passengers as passenger, passengerIdx}
					{@const isSelected = cState.selectedPassengerIdx === passengerIdx}
					{@const passengerMeals = getSelectedPassengerMeals(passengerIdx)}
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
								{#if (passengerMeals.length ?? 0) > 0}
									<p class="text-sm text-gray-500">{passengerMeals.length} Meals</p>
								{:else}
									<p class="text-sm text-gray-500">No Meals</p>
								{/if}
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
		<div class="h-full p-4">
			<Badge class="mb-4 w-full space-x-2 rounded-sm bg-white! py-2 text-gray-700 shadow-xs">
				<Icon icon="material-symbols:warning" class="text-orange-400" width={18} height={18} />
				<p>Max selection 3 meals</p>
			</Badge>
			<!-- Meal Items -->
			<div class="flex flex-col gap-y-2">
				{#each cState.selectedSegment.Items as mealItem}
					{@const selected = getSelectedPassengerMeals(cState.selectedPassengerIdx)
						.map((item) => item.mealId)
						.includes(mealItem.Code)}
					<Button
						variant="outline"
						role="checkbox"
						aria-checked={selected}
						class={cn(
							'h-fit items-start justify-between p-4 shadow-xs focus-visible:outline-hidden',
							{
								'ring-2 ring-primary': selected
							}
						)}
						onclick={() => {
							onMealSelect(mealItem);
						}}
					>
						<div class="flex gap-x-2 text-left">
							<div class="pt-1">
								<Checkbox bind:checked={() => selected, (_) => {}} />
							</div>
							<div class="max-w-60 flex-1 space-y-1 truncate">
								<p class="truncate text-base font-semibold">{mealItem.Name}</p>
								<p class="text-sm font-normal text-gray-500">
									{formatThousand(mealItem.Price)} IDR/pax
								</p>
							</div>
						</div>
						<img src={mealItem.Image} class="h-14 w-14 rounded-sm object-cover" alt="meal" />
					</Button>
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			{#if totalPriceSelectedMealBySegment !== ''}
				<div>
					<p class="text-sm">Subtotal</p>

					<p class="font-semibold">
						{totalPriceSelectedMealBySegment}
					</p>
				</div>
			{:else}
				<p class="text-sm text-gray-500"><span class="font-semibold">No Selected</span></p>
			{/if}

			<Button class="px-8" onclick={() => (isOpenMealSelection = false)}>Save</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
