

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { ItemPage, MItemPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MItemPage />
</div>
{:else}
<div class="container space-y-5">
	<ItemPage />
</div>
{/if}
