<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { ProductPage, MProductPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<div class="p-5">
		<MProductPage />
	</div>
{:else}
	<div class="container space-y-5">
		<ProductPage />
	</div>
{/if}
