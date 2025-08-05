<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { ManageDeposit, MManageDeposit } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MManageDeposit />
{:else}
<div class="container">
	<ManageDeposit />
</div>
{/if}
