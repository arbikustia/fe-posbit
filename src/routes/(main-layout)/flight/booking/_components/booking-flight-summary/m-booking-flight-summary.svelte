<script lang="ts">
	import tripDummy from '$lib/dummy/trip.json';
	import MBookingFlightSummaryItem from './m-booking-flight-summary-item.svelte';
</script>

{#each new Array(2) as _, i}
	<MBookingFlightSummaryItem trip={tripDummy} number={i + 1} />
{/each}
