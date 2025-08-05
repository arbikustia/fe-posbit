<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { TrainBookingPage, MTrainBookingPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MTrainBookingPage />
{:else}
	<TrainBookingPage />
{/if}
