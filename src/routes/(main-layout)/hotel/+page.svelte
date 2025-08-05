<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import HotelPage from './_components/page/hotel-page.svelte';
	import MHotelPage from './_components/page/m-hotel-page.svelte';

	const { isMobile } = getDeviceContext();
</script>

<svelte:head>
	<title>Hotel</title>
</svelte:head>

{#if isMobile}
	<MHotelPage />
{:else}
	<HotelPage />
{/if}
