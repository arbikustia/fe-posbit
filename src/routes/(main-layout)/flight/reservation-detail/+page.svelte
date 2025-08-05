<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { FlightReservationDetailPage, MFlightReservationDetailPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MFlightReservationDetailPage />
{:else}
	<FlightReservationDetailPage />
{/if}
