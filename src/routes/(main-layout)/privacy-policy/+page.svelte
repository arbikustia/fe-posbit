<script lang="ts">
	import { OSGPrivacyPolicy } from '$lib/components/privacy-policy';
	import { getDeviceContext } from '$lib/context/device';
	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<div class="p-5">
		<OSGPrivacyPolicy hiddenClose={true} close={() => {}} />
	</div>
{:else}
	<div class="container">
		<OSGPrivacyPolicy hiddenClose={true} close={() => {}} />
	</div>
{/if}
