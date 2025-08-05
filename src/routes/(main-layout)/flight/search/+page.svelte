<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { FlightSearchPage, MFlightSearchPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MFlightSearchPage />
{:else}
	<FlightSearchPage />
{/if}
