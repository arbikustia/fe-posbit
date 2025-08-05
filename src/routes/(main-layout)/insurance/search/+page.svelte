<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { ScrollToTop } from '../../hotel/detail/_components/scroll-to-top';
	import { MSearchPage, SearchPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MSearchPage />
{:else}
	<SearchPage />
	<ScrollToTop />
{/if}
