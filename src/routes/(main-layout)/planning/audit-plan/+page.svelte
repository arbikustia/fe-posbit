<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { AuditPlanPage, MAuditPlanPage } from './_components/page/index';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<div class="p-5">
		<MAuditPlanPage />
	</div>
{:else}
	<div class="container space-y-5">
		<AuditPlanPage />
	</div>
{/if}
