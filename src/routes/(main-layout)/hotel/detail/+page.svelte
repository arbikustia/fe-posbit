<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { DetailHotel, MDetailHotel } from './_components/page';
	import { ScrollToTop } from './_components/scroll-to-top';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MDetailHotel />
{:else}
	<DetailHotel />
	<ScrollToTop />
{/if}
