<script lang="ts">
	import { cn } from '$lib/utils';
	import { Building } from '@lucide/svelte';

	type TripSummaryCompanyHeaderProps = {
		companyName: string;
		class?: string;
	};

	let { companyName, class: className }: TripSummaryCompanyHeaderProps = $props();
</script>

<div class="flex items-center gap-2">
	<Building />
	<div class={cn('font-semibold', className)}>{companyName}</div>
</div>
