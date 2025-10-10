<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { HomeLayout, MHomeLayout } from './layout';

	const { isMobile } = getDeviceContext();
</script>
<svelte:head>
	<title>Home | Bantuit</title>
</svelte:head>

{#if isMobile}
	<!-- <MHomeLayout /> -->
	 	 <div>HomeLayout</div>
{:else}
	<!-- <HomeLayout /> -->
	 <div>HomeLayout</div>
{/if}
