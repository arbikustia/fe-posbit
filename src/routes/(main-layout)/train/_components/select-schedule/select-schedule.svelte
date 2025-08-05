<script lang="ts">
	import type { Route, SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { MOSGDatePicker, OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import dayjs from 'dayjs';
	import type { SelectScheduleProps } from './types';
	import { useSelectSchedule } from './select-schedule.svelte.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { slide } from 'svelte/transition';

	let {
		route = $bindable(),
		tripType = $bindable(),
		trainType,
		class: className,
		showLabel = true,
		variant
	}: SelectScheduleProps = $props();

	const { getMaxDateValue } = useSelectSchedule();

	const maxDateValue = $derived(getMaxDateValue(trainType));
</script>

{#if variant == 'combination'}
	<div class="rounded-md border">
		<div class="flex items-center justify-center gap-2 py-1 pr-2">
			<div class="w-full">
				<p class="px-2 text-xs text-gray-500">Departure Date</p>
				<OSGDatePicker
					bind:value={route.departureDate}
					maxValue={maxDateValue}
					otherDate={tripType === 'oneway' ? undefined : route.returnDate}
					class="h-8  py-0"
					iconClass="text-primary"
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
				<OSGDatePicker
					bind:value={route.returnDate}
					minValue={route.departureDate}
					maxValue={maxDateValue}
					otherDate={route.departureDate}
					positionCalendar="end"
					class="h-8  py-0"
					iconClass="text-primary"
				/>
			</div>
		{/if}
	</div>
{:else}
	<div
		class={cn(
			'shadow-xs flex flex-none items-center gap-2 rounded-lg border border-gray-200 p-1',
			className
		)}
	>
		<div class="relative w-[160px]">
			{#if showLabel}
				<div class="absolute -top-7 text-sm font-medium text-gray-600">Departure Date</div>
			{/if}
			{#if tripType === 'oneway'}
				<OSGDatePicker bind:value={route.departureDate} maxValue={maxDateValue} />
			{:else}
				<OSGDatePicker
					bind:value={route.departureDate}
					otherDate={route.returnDate}
					maxValue={maxDateValue}
				/>
			{/if}
		</div>
		<div class="relative w-[160px]">
			{#if tripType === 'roundtrip' && showLabel}
				<div class="absolute -top-7 text-sm font-medium text-gray-600">Return Date</div>
			{/if}
			{#if tripType === 'oneway'}
				<Button
					class="text-muted-foreground w-full"
					variant="ghost"
					onclick={() => {
						tripType = 'roundtrip';
					}}>Add Return</Button
				>
			{:else}
				<OSGDatePicker
					bind:value={route.returnDate}
					minValue={route.departureDate}
					maxValue={maxDateValue}
					otherDate={route.departureDate}
					positionCalendar="end"
				/>
			{/if}
		</div>
	</div>
{/if}
