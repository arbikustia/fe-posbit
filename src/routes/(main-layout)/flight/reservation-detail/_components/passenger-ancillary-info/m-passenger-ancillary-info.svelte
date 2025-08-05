<script lang="ts">
	import { People } from '$lib/components/icons';
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Switch } from '$lib/components/ui/switch';
	import { displayPassengerDetail } from '$lib/helpers/search-flight-helper';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import { InfoRow } from '../info-row';
	import type { PassengerAncillaryInfoProps } from './types';
	import { usePassengerAncillaryInfo } from './passenger-ancillary-info.svelte.js';
	import dayjs from 'dayjs';
	import { formatThousand } from '$lib/helpers/number-helper';

	let { passengers }: Pick<PassengerAncillaryInfoProps, 'passengers'> = $props();

	const { countPassengerTypes } = usePassengerAncillaryInfo();

	let showDetail = $state(false);
</script>

{#snippet passengerDetail(label: string, value: string)}
	<InfoRow {label}>
		<div class="col-span-2">: {value}</div>
	</InfoRow>
{/snippet}

<Card.Root class="gap-0 overflow-hidden rounded-none py-0">
	<Card.Header class="flex items-center justify-between p-2">
		<div class="flex items-center gap-x-2">
			<People />
			<div>
				<p class="text-sm">Passengers</p>
				<p class="text-[0.6rem] font-normal">
					{displayPassengerDetail(countPassengerTypes(passengers))}
				</p>
			</div>
		</div>

		<div class="flex items-center gap-2">
			<div class="text-xs">Show Details</div>
			<Switch bind:checked={showDetail} />
		</div>
	</Card.Header>
	<Separator />
	<Card.Content class="p-4">
		<div>
			<!-- Passenger 1 -->
			{#each passengers as passenger, passengerIdx}
				{@const isLast = passengerIdx === passengers.length - 1}
				<div>
					<div class="mb-4 flex items-center justify-between text-sm">
						<div class="flex items-center gap-2">
							<div
								class="flex h-6 w-6 items-center justify-center rounded-md bg-gray-500 text-white"
							>
								1
							</div>
							<div class="line-clamp-1 max-w-32">{passenger.fullName}</div>
							<Badge class="rounded-sm bg-gray-200 px-1 py-0 text-[0.6rem] text-gray-600"
								>Adult</Badge
							>
						</div>
						{#if passenger.ticketNumber}
							<div class="text-right text-[0.6rem]">Ticket Number: {passenger.ticketNumber}</div>
						{/if}
					</div>

					{#if showDetail}
						<div class="mb-4 rounded-md border bg-gray-100 text-sm" transition:slide>
							{#if passenger.phone}
								{@render passengerDetail('Phone', passenger.phone)}
								<Separator />
							{/if}
							{#if passenger.membership}
								{@render passengerDetail(
									'Membership',
									`${passenger.membership.number} (${passenger.membership.type})`
								)}
								<Separator />
							{/if}
							{#if passenger.passport}
								{@render passengerDetail('Passport', passenger.passport.number)}
								<Separator />
								{@render passengerDetail(
									'Passport Expire',
									dayjs(passenger.passport.expiryDate).format('DD MMM YYYY')
								)}
								<Separator />
							{/if}
							{#if passenger.dateOfBirth}
								{@render passengerDetail(
									'Date of Birth',
									dayjs(passenger.dateOfBirth).format('DD MMM YYYY')
								)}
							{/if}
						</div>
					{/if}

					<div class="space-y-4">
						{#each passenger.flightAncillaries as flightAncillary, flightAncillaryIdx}
							<div class="rounded-md border bg-gray-100">
								<div class="flex items-center justify-between p-2">
									<Badge class="bg-gray-300! rounded-lg text-gray-600"
										>{passenger.flightAncillaries.length > 2
											? `Flight ${flightAncillaryIdx + 1}`
											: flightAncillaryIdx === 0
												? 'Departure'
												: 'Return'}</Badge
									>
									<!-- <div class="text-[0.6rem]">Ticket Number: 2348736458734534534</div> -->
								</div>
								<Separator />
								<div class="p-2">
									{#each flightAncillary.segments as segment, segmentIdx}
										{@const isLastSegment = segmentIdx === flightAncillary.segments.length - 1}
										{@const baggage = segment.ancillaries.find(
											(ancillary) => ancillary.code === 'BAGGAGE'
										)}
										{@const seat = segment.ancillaries.find(
											(ancillary) => ancillary.code === 'SEAT'
										)}
										{@const meals = segment.ancillaries.filter(
											(ancillary) => ancillary.code === 'MEAL'
										)}
										{@const mealAmount = meals.reduce((total, meal) => total + meal.amount, 0)}
										<div class="grid grid-cols-3 gap-2 text-sm">
											<div>
												{segment.origin} - {segment.destination}
											</div>
											<div class="col-span-2">
												{#if segment.ancillaries.length > 0}
													{#if baggage}
														<div class="flex items-center justify-between">
															<div class="flex items-center gap-1 text-gray-500">
																<Icon icon="lucide:baggage-claim" width="14" height="14" />
																{baggage.name}
															</div>
															<div>{formatThousand(baggage.amount)} {baggage.currency}</div>
														</div>
													{/if}
													{#if seat}
														<div class="flex items-center justify-between">
															<div class="flex items-center gap-1 text-gray-500">
																<Icon icon="hugeicons:airplane-seat" width="14" height="14" />
																{seat.seatNumber}
															</div>
															<div>{formatThousand(seat.amount)} {seat.currency}</div>
														</div>
													{/if}
													{#if meals.length > 0}
														<div class="flex items-center justify-between">
															<div class="flex items-center gap-1 text-gray-500">
																<Icon icon="cbi:mealie" width="14" height="14" />
																{meals.length} meal
															</div>
															<div>{formatThousand(mealAmount)} {meals[0].currency}</div>
														</div>
													{/if}
												{:else}
													<div class="text-gray-400">No Ancillary Added</div>
												{/if}
											</div>
										</div>

										{#if !isLastSegment}
											<OSGDashSeparator class="my-2 border border-gray-300" />
										{/if}
									{/each}
								</div>
							</div>
						{/each}
					</div>
				</div>
				{#if !isLast}
					<OSGDashSeparator class="my-4 border border-gray-300" />
				{/if}
			{/each}
		</div>
	</Card.Content>
</Card.Root>
