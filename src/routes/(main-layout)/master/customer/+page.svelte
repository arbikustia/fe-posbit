

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { CustomerPage, MCustomerPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MCustomerPage />
</div>
{:else}
<div class="container space-y-5">
	<CustomerPage />
</div>
{/if}
