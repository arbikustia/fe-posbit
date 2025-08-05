<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { CompanyProfilePage, MCompanyProfilePage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MCompanyProfilePage />
{:else}
	<CompanyProfilePage />
{/if}
