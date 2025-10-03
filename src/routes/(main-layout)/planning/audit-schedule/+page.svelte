<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { AuditSchedulePage, MAuditSchedulePage } from './_components/page/index';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<div class="p-5">
		<MAuditSchedulePage />
	</div>
{:else}
	<div class="container space-y-5">
		<AuditSchedulePage />
	</div>
{/if}
