<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { FlightBookingPage, MFlightBookingPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MFlightBookingPage />
{:else}
	<FlightBookingPage />
{/if}
