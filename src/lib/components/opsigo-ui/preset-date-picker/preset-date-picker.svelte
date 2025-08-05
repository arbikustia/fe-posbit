<script lang="ts">
	import ActiveSelectionIndicator from '$lib/components/opsigo-ui/active-selection-indicator/active-selection-indicator.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as RangeCalendar from '$lib/components/ui/range-calendar';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils.js';
	import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import dayjs from 'dayjs';
	import { OSGMonthRangePicker } from '../month-range-picker';
	import { OSGWeekRangePicker } from '../week-range-picker';
	import { lastMonth, presets } from './preset';
	import { usePresetDatePicker } from './preset-date-picker.svelte.js';
	import type { PresetDatePickerProps } from './types';

	let {
		value = $bindable(),
		placeholder = 'Select a date',
		triggerClass = ''
	}: PresetDatePickerProps = $props();

	const { state, getSelectedPresetLabel, formatValueToLabel } = usePresetDatePicker();

	const triggerContent = $derived.by(() => {
		if (value?.start && value?.end) {
			return `${dayjs(value.start.toString()).format('DD MMMM YYYY')} - ${dayjs(value.end.toString()).format('DD MMMM YYYY')}`;
		}

		return placeholder;
	});
</script>

<Popover.Root bind:open={state.open}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				{...props}
				class={cn('w-fit justify-start pl-2 text-left font-normal', triggerClass)}
			>
				<div class="text-muted-foreground">
					<CalendarIcon class="mr-1" />
				</div>

				{triggerContent}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-2xl p-0" side="bottom">
		<div class="grid grid-cols-12 border-b">
			<div class="h-82 col-span-9 border-r">
				{#if state.selectedPreset === 'by-month'}
					<OSGMonthRangePicker
						bind:value={state.internalValue}
						maxValue={parseDate(dayjs().format('YYYY-MM-DD'))}
						minValue={new CalendarDate(2014, 1, 1)}
					/>
				{:else if state.selectedPreset === 'per-week'}
					<OSGWeekRangePicker
						bind:value={state.internalValue}
						numberOfMonths={2}
						captionLayout="dropdown"
						placeholder={parseDate(lastMonth.format('YYYY-MM-DD'))}
						maxValue={parseDate(dayjs().format('YYYY-MM-DD'))}
						minValue={new CalendarDate(2014, 1, 1)}
						weekStartsOn={1}
					/>
				{:else}
					<RangeCalendar.RangeCalendar
						bind:value={state.internalValue}
						numberOfMonths={2}
						maxValue={parseDate(dayjs().format('YYYY-MM-DD'))}
						minValue={new CalendarDate(2014, 1, 1)}
						captionLayout="dropdown"
						placeholder={parseDate(lastMonth.format('YYYY-MM-DD'))}
						onValueChange={() => {
							state.selectedPreset = undefined;
						}}
						weekStartsOn={1}
					>
						{#snippet day({ outsideMonth })}
							{#if !outsideMonth}
								<RangeCalendar.Day
									class="[&[data-today]:not([data-selected])]:text-primary [&[data-today]:not([data-selected])]:bg-transparent"
								/>
							{/if}
						{/snippet}
					</RangeCalendar.RangeCalendar>
				{/if}
			</div>
			<div class="col-span-3 py-3">
				<div class="flex flex-col gap-1">
					{#each presets as preset}
						<Button
							variant="ghost"
							class={cn('relative h-fit justify-start rounded-none p-1 px-4 font-normal', {
								'font-semibold': state.selectedPreset === preset.id
							})}
							onclick={() => {
								state.internalValue = preset.value;
								state.selectedPreset = preset.id;
							}}
						>
							{preset.label}
							<ActiveSelectionIndicator isActive={state.selectedPreset === preset.id} />
						</Button>
					{/each}
					<div class="my-1 px-4">
						<Separator />
					</div>
					<Button
						variant="ghost"
						class={cn('relative h-fit justify-start rounded-none p-1 px-4 font-normal', {
							'font-semibold': state.selectedPreset === 'per-week'
						})}
						onclick={() => {
							state.selectedPreset = 'per-week';

							state.internalValue = {
								start: parseDate(dayjs().day(1).format('YYYY-MM-DD')),
								end: today(getLocalTimeZone())
							};
						}}
					>
						Per Week
						<ActiveSelectionIndicator isActive={state.selectedPreset === 'per-week'} />
					</Button>
					<Button
						variant="ghost"
						class={cn('relative h-fit justify-start rounded-none p-1 px-4 font-normal', {
							'font-semibold': state.selectedPreset === 'by-month'
						})}
						onclick={() => {
							state.selectedPreset = 'by-month';

							state.internalValue = {
								start: today(getLocalTimeZone()).set({ day: 1 }),
								end: today(getLocalTimeZone())
							};
						}}
					>
						By Month
						<ActiveSelectionIndicator isActive={state.selectedPreset === 'by-month'} />
					</Button>
				</div>
			</div>
		</div>
		<div class="flex items-center justify-between p-3">
			<div>
				<Badge variant="secondary" class="rounded-full">{getSelectedPresetLabel()}</Badge>
				<div class="mt-1 text-sm">{formatValueToLabel()}</div>
			</div>
			<div class="flex items-center gap-2">
				<Button variant="outline" onclick={() => (state.open = false)}>Cancel</Button>
				<Button
					disabled={!state.internalValue.start || !state.internalValue.end}
					onclick={() => {
						value = state.internalValue;
						state.open = false;
					}}>Apply</Button
				>
			</div>
		</div>
	</Popover.Content>
</Popover.Root>
