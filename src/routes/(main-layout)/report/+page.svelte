

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { ReportPage, MReportPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MReportPage />
</div>
{:else}
<div class="p-5 space-y-5">
	<ReportPage />
</div>
{/if}
