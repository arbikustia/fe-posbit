

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { PurchasePage, MPurchasePage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MPurchasePage />
</div>
{:else}
<div class="container space-y-5">
	<PurchasePage />
</div>	
{/if}
