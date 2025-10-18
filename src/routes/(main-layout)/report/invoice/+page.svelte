

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { InvoicePage, MInvoicePage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MInvoicePage />
</div>
{:else}
<div class="container space-y-5">
	<InvoicePage />
</div>
{/if}
