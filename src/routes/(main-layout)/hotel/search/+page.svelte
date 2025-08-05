<script lang="ts">
	import { getDeviceContext } from '$lib/context/device.js';
	import { useFlightService } from '$lib/hooks/use-flight-service.svelte.js';
	import { useFlightSearchPage } from '../../flight/search/_components/page/flight-search-page.svelte.js';
	import SearchHotelPanel from '../_components/search-hotel-panel/search-hotel-panel.svelte';
	import ScrollToTop from '../detail/_components/scroll-to-top/scroll-to-top.svelte';
	import { ContentDisplay, MContentDisplay } from './_components/content-display';
	import { HotelSkeleton } from './_components/hotel-skeleton';
	import { SearchProgress } from './_components/search-progres';

	const { getSchedule } = useFlightService();
	const { state: pageState, scheduleResults, progressPercent } = useFlightSearchPage();
	const { isMobile } = getDeviceContext();
</script>

<section class="space-y-5">
	{#if isMobile}
		<MContentDisplay />
	{:else if $scheduleResults.length > 0}
		<SearchHotelPanel
			variant={'sticky'}
			isLoading={$progressPercent.isLoading}
			onSubmitCallback={() => {
				pageState.currentScheduleIdx = 0;
				getSchedule();
			}}
		/>
		<div class="container pt-0">
			<SearchProgress />
			<ContentDisplay />
			<ScrollToTop />
		</div>
	{:else}
		<HotelSkeleton />
	{/if}
</section>
