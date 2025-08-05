<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { displayPassengerDetail } from '$lib/helpers/search-train-helper';
	import { TripRouteInfo } from '../../../_components/trip-route-info';
	import {
		TripSummaryCompanyHeader,
		TripSummarySegmentLabel
	} from '../../../_components/trip-summary';
	import BookingSummaryItem from './booking-summary-item.svelte';
</script>

<Card.Root>
	<Card.Content>
		<div class="mb-5 space-y-2">
			<TripRouteInfo
				origin="Gambir"
				destination="Bandung"
				originCode="GMR"
				destinationCode="BDG"
				tripType="roundtrip"
			/>
			<TripSummaryCompanyHeader
				class="text-sm font-medium"
				companyName="RSP (Reka Sinergi Pratama)"
			/>
			<p class="mt-4! text-sm font-normal text-gray-500">
				{displayPassengerDetail({
					adult: 2,
					infant: 1
				})}
			</p>
		</div>
		<div class="space-y-8">
			<div class="space-y-4">
				<TripSummarySegmentLabel label="Departure" labelType={'text'} isActive={false} />

				<BookingSummaryItem />
			</div>
			<div class="space-y-4">
				<TripSummarySegmentLabel label="Return" labelType={'text'} isActive={false} />

				<BookingSummaryItem />
			</div>
		</div>
	</Card.Content>
</Card.Root>
