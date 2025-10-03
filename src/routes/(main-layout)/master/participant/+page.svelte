

<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { ParticipantPage, MParticipantPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
<div class="p-5">
	<MParticipantPage />
</div>
{:else}
<div class="container space-y-5">
	<ParticipantPage />
</div>
{/if}
