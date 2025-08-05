<script lang="ts">
	import { MOSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { slide } from 'svelte/transition';
	import { useSelectSchedule } from './select-schedule.svelte.js';
	import type { SelectScheduleProps } from './types';

	let {
		route = $bindable(),
		tripType = $bindable(),
		trainType,
		class: className
	}: SelectScheduleProps = $props();

	const { getMaxDateValue } = useSelectSchedule();

	const maxDateValue = $derived(getMaxDateValue(trainType));
</script>

<div class="rounded-md border">
	<div class="flex items-center py-1 pr-2">
		<div class="w-full">
			<p class="px-2 text-xs text-gray-500">Departure Date</p>
			<MOSGDatePicker
				bind:value={route.departureDate}
				otherDate={tripType === 'oneway' ? undefined : route.returnDate}
				maxValue={maxDateValue}
				class="h-8 py-0"
				iconClass="text-primary"
				title="Select Departure Date"
			/>
		</div>
		<div class="flex flex-none items-center space-x-2">
			<Label class="text-xs font-normal text-gray-500" for="round-trip">Round-Trip?</Label>
			<Switch
				checked={tripType === 'roundtrip'}
				id="round-trip"
				onCheckedChange={(checked) => {
					tripType = checked ? 'roundtrip' : 'oneway';
				}}
			/>
		</div>
	</div>

	{#if tripType === 'roundtrip'}
		<div class="px-2">
			<Separator />
		</div>
		<div class="py-1" transition:slide>
			<p class="px-2 text-xs text-gray-500">Return Date</p>
			<MOSGDatePicker
				bind:value={route.returnDate}
				minValue={route.departureDate}
				otherDate={route.departureDate}
				maxValue={maxDateValue}
				class="h-8 py-0"
				iconClass="text-primary"
				title="Select Return Date"
			/>
		</div>
	{/if}
</div>
