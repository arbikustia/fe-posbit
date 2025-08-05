<script lang="ts">
	import { Building } from '@lucide/svelte';

	type FlightSummaryCompanyHeaderProps = {
		companyName: string;
	};

	let { companyName }: FlightSummaryCompanyHeaderProps = $props();
</script>

<div class="flex items-center gap-2">
	<Building />
	<div class="font-semibold">{companyName}</div>
</div>
