

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { LocationPage, MLocationPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MLocationPage />
</div>
{:else}
<div class="container space-y-5">
	<LocationPage />
</div>
{/if}
