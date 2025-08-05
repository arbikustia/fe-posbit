<script lang="ts">
	import { OSGDisclaimer } from '$lib/components/disclaimer';
	import { getDeviceContext } from '$lib/context/device';
	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<div class="p-5">
		<OSGDisclaimer hiddenClose={true} close={() => {}} />
	</div>
{:else}
	<div class="container">
		<OSGDisclaimer hiddenClose={true} close={() => {}} />
	</div>
{/if}
