

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { UserPage, MUserPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MUserPage />
</div>
{:else}
<div class="container space-y-5">
	<UserPage />
</div>
{/if}
