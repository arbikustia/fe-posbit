

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { PurchaseReportPage, MPurchaseReportPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MPurchaseReportPage />
</div>
{:else}
<div class="container space-y-5">
	<PurchaseReportPage />
</div>
{/if}
