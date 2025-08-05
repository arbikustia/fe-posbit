<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { ScrollToTop } from '../detail/_components/scroll-to-top';
	import { HotelBookingPage, MHotelBookingPage } from './components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MHotelBookingPage />
{:else}
	<HotelBookingPage />
	<ScrollToTop />
{/if}
