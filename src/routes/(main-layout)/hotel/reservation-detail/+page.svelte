<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { MReservationDetail, ReservationDetail } from './_components/page';
	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MReservationDetail />
{:else}
	<ReservationDetail />
{/if}
