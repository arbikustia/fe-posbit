<script lang="ts">
	import { MOSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import Button from '$lib/components/ui/button/button.svelte';
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

<div class="relative flex flex-col gap-1">
	<Button variant="secondary" class="w-full">
		<MOSGDatePicker
			bind:value={dateRange.start}
			otherDate={dateRange.end}
			class="h-8 px-0 py-0 text-primary"
			iconClass="text-primary"
            
		/>
	</Button>

	<div class="px-2">
		{#if countDays}
			<Button variant="link" class="absolute right-2 top-7 rounded-lg border bg-white px-2 "
				>{countDays}</Button
			>
		{/if}
	</div>
	<Button variant="secondary" class="w-full">
		<MOSGDatePicker
			bind:value={dateRange.end}
			minValue={dateRange.start}
			otherDate={dateRange.start}
			positionCalendar="end"
			class="h-8 px-0 py-0 text-primary"
			iconClass="text-primary"
		/>
	</Button>
</div>
