

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { DepartmentPage, MDepartmentPage } from './_components/page/index';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MDepartmentPage />
</div>
{:else}
<div class="container space-y-5">
	<DepartmentPage />
</div>
{/if}
