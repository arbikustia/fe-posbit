<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { SearchFormBanner } from '../(component)/search-form-banner';
	import { ScrollToTop } from '../hotel/detail/_components/scroll-to-top';
	import { LastSearchInsurance } from './_components/last-search';
	import { InsurancePage, MInsurancePage } from './_components/page';
	import { SearchFormInsurance } from './_components/search-form';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MInsurancePage />
{:else}
	<InsurancePage />
{/if}
