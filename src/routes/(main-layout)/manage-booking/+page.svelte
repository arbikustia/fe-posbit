
<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { Booking, MBooking } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MBooking />
{:else}
	<Booking />
{/if}
