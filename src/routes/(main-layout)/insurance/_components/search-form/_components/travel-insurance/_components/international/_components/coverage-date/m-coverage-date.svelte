<script lang="ts">
	import { MOSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { dateRange = $bindable(), startLabel = 'Start Date', endLabel = 'End Date' } = $props();

	const countDays = $derived.by(() => {
		if (dateRange.start && dateRange.end) {
			const start = new Date(dateRange.start);
			const end = new Date(dateRange.end);
			const diffInMs = Number(end) - Number(start);
			const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
			return `${diffInDays + 1} days`;
		}
	});
</script>

<div class="relative rounded-md border">
	<div class="py-1">
		<p class="px-2 text-xs text-gray-500">{startLabel}</p>
		<MOSGDatePicker
			bind:value={dateRange.start}
			otherDate={dateRange.end}
			class="h-8  py-0"
			iconClass="text-primary"
		/>
	</div>

	<div class="px-2">
		<Separator />
		<p class="absolute top-11 right-5 bg-white px-2 text-sm text-gray-500">{countDays}</p>
	</div>
	<div class="py-1">
		<p class="px-2 text-xs text-gray-500">{endLabel}</p>
		<MOSGDatePicker
			bind:value={dateRange.end}
			minValue={dateRange.start}
			otherDate={dateRange.start}
			positionCalendar="end"
			class="h-8  py-0"
			iconClass="text-primary"
		/>
	</div>
</div>