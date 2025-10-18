
<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { PointPage, MPointPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MPointPage />
</div>
{:else}
<div class="container space-y-5">
	<PointPage />
</div>
{/if}
