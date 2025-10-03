<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { CategoryPage, MCategoryPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<div class="p-5">
		<MCategoryPage />
	</div>
{:else}
	<div class="container space-y-5">
		<CategoryPage />
	</div>
{/if}
