<script lang="ts">
	import { TripSummarySegmentLabel } from '../../../_components/trip-summary';
	import MBookingSummaryItem from './m-booking-summary-item.svelte';
</script>

<div class="space-y-4">
	<div class="space-y-2">
		<TripSummarySegmentLabel label="Departure" labelType={'text'} isActive={false} />

		<MBookingSummaryItem />
	</div>
	<div class="space-y-2">
		<TripSummarySegmentLabel label="Return" labelType={'text'} isActive={false} />

		<MBookingSummaryItem />
	</div>
</div>
