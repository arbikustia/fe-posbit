<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { MTrainPage, TrainPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

<svelte:head>
	<title>Train</title>
</svelte:head>

{#if isMobile}
	<MTrainPage />
{:else}
	<TrainPage />
{/if}
