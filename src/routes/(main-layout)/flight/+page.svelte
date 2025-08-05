<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { FlightPage, MFlightPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

<svelte:head>
	<title>Flight</title>
</svelte:head>

{#if isMobile}
	<MFlightPage />
{:else}
	<FlightPage />
{/if}
