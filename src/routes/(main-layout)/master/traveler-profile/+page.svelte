<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { MTravelerProfilePage, TravelerProfilePage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MTravelerProfilePage />
{:else}
	<TravelerProfilePage />
{/if}
