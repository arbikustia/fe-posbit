<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { TrainSearchPage, MTrainSearchPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MTrainSearchPage />
{:else}
	<TrainSearchPage />
{/if}
