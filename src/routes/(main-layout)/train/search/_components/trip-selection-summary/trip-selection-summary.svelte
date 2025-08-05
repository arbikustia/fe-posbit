<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { displayPassengerDetail } from '$lib/helpers/search-train-helper';
	import { FareDetail } from '../../../_components/fare-detail';
	import { TripRouteInfo } from '../../../_components/trip-route-info';
	import {
		TripSummaryCompanyHeader,
		TripSummarySegmentLabel
	} from '../../../_components/trip-summary';
	import TripSelectionSummaryItem from './trip-selection-summary-item.svelte';
	import type { TripSelectionSummaryProps } from './types';

	let { open = $bindable() }: TripSelectionSummaryProps = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="lg:max-w-200 overflow-hidden p-0">
		<Dialog.Header class="bg-card p-4 shadow-sm">
			<Dialog.Title class="space-y-2">
				<TripRouteInfo
					origin="Gambir"
					destination="Bandung"
					originCode="GMR"
					destinationCode="BDG"
				/>
				<TripSummaryCompanyHeader
					class="text-sm font-medium"
					companyName="RSP (Reka Sinergi Pratama)"
				/>
				<p class="text-sm font-normal text-gray-500">
					{displayPassengerDetail({
						adult: 2,
						infant: 1
					})}
				</p>
			</Dialog.Title>
		</Dialog.Header>
		<div class="max-h-[calc(100vh-200px)] overflow-y-auto p-4 px-6">
			<div class="grid grid-cols-12 gap-4">
				<div class="col-span-7 space-y-4">
					<div class="space-y-2">
						<TripSummarySegmentLabel label="Departure" labelType={'text'} isActive={false} />
						<div class="space-y-2">
							<TripSelectionSummaryItem />
						</div>
					</div>
					<div class="space-y-2">
						<TripSummarySegmentLabel label="Return" labelType={'text'} isActive={false} />
						<div class="space-y-2">
							<TripSelectionSummaryItem />
						</div>
					</div>
				</div>

				<div class="col-span-5 space-y-2">
					<div class="w-fit rounded-full bg-gray-200 px-2 text-center text-sm">Fare Detail</div>
					<FareDetail useAccordion={false} />
				</div>
			</div>
		</div>

		<Dialog.Footer class="bg-card border-t-2 p-4">
			<Button variant="ghost" class="text-muted-foreground">Change Schedule</Button>
			<Button href="/train/booking">Continue</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
