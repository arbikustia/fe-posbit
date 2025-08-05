<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { InsuranceBookingPage, MInsuranceBookingPage } from './_components/page';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MInsuranceBookingPage />
{:else}
	<InsuranceBookingPage />
{/if}
