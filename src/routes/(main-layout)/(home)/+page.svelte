<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { HomeLayout, MHomeLayout } from './layout';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MHomeLayout />
{:else}
	<HomeLayout />
{/if}
