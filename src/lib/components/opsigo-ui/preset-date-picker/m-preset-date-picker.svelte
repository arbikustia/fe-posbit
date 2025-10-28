<script lang="ts">
	import ActiveSelectionIndicator from '$lib/components/opsigo-ui/active-selection-indicator/active-selection-indicator.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as RangeCalendar from '$lib/components/ui/range-calendar';
	import { cn } from '$lib/utils.js';
	import { CalendarDate, getLocalTimeZone, parseDate, today } from '@internationalized/date';
	import  ChevronDown  from '@lucide/svelte/icons/chevron-down';
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
		triggerClass = '',
		title = 'Select Date'
	}: PresetDatePickerProps & { title?: string } = $props();

	const { state, getSelectedPresetLabel, formatValueToLabel } = usePresetDatePicker();

	const triggerContent = $derived.by(() => {
		if (value?.start && value?.end) {
			return `${dayjs(value.start.toString()).format('DD MMMM YYYY')} - ${dayjs(value.end.toString()).format('DD MMMM YYYY')}`;
		}

		return placeholder;
	});
</script>

<Drawer.Root bind:open={state.open}>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				{...props}
				class={cn('w-full justify-start pl-2 text-left font-normal', triggerClass)}
			>
				<div class="text-muted-foreground">
					<CalendarIcon class="mr-1" />
				</div>

				{triggerContent}
			</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content class="m-date-content border-0! w-auto p-0">
		<div class="pb-32">
			<div class="px-4 pt-2 text-lg font-semibold">{title}</div>
			<div class="p-4">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-between')}
					>
						{getSelectedPresetLabel()}
						<ChevronDown />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-[92vw]">
						<DropdownMenu.Group>
							{#each presets as preset}
								<DropdownMenu.Item
									class={cn('px-4', {
										'font-semibold': state.selectedPreset === preset.id
									})}
									onclick={() => {
										state.internalValue = preset.value;
										state.selectedPreset = preset.id;
									}}
								>
									{preset.label}
									<ActiveSelectionIndicator isActive={state.selectedPreset === preset.id} />
								</DropdownMenu.Item>
							{/each}

							<DropdownMenu.Separator />
							<DropdownMenu.Item
								class={cn('px-4', {
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
							</DropdownMenu.Item>
							<DropdownMenu.Item
								class={cn('px-4', {
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
							</DropdownMenu.Item>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			{#if state.selectedPreset === 'by-month'}
				<OSGMonthRangePicker
					class="gap-10 md:flex-col"
					bind:value={state.internalValue}
					maxValue={parseDate(dayjs().format('YYYY-MM-DD'))}
					minValue={new CalendarDate(2014, 1, 1)}
					isSingleView
				/>
			{:else if state.selectedPreset === 'per-week'}
				<OSGWeekRangePicker
					class="m-preset-date-picker-calendar mx-auto w-full [--cell-size:clamp(0px,calc(100vw/7.5),58px)]"
					bind:value={state.internalValue}
					numberOfMonths={1}
					captionLayout="dropdown"
					placeholder={parseDate(lastMonth.format('YYYY-MM-DD'))}
					maxValue={parseDate(dayjs().format('YYYY-MM-DD'))}
					minValue={new CalendarDate(2014, 1, 1)}
					weekStartsOn={1}
				/>
			{:else}
				<RangeCalendar.RangeCalendar
					bind:value={state.internalValue}
					class="m-preset-date-picker-calendar mx-auto w-full [--cell-size:clamp(0px,calc(100vw/7.5),58px)]"
					numberOfMonths={1}
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
		<div class="fixed bottom-0 w-full space-y-2 border-t bg-white p-2">
			<div>
				<Badge variant="secondary" class="rounded-full">{getSelectedPresetLabel()}</Badge>
				<div class="mt-1 text-sm">{formatValueToLabel()}</div>
			</div>

			<div class="flex items-center gap-2">
				<Button variant="outline" class="flex-1" onclick={() => (state.open = false)}>Cancel</Button
				>
				<Button
					class="flex-1"
					disabled={!state.internalValue.start || !state.internalValue.end}
					onclick={() => {
						value = state.internalValue;
						state.open = false;
					}}>Apply</Button
				>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>

<style>
	@reference '$appCss';
	:global(.m-preset-date-picker-calendar div[data-range-calendar-root] div:nth-child(2)) {
		@apply md:flex-col;
	}
	:global(.m-preset-date-picker-calendar table[data-range-calendar-grid]) {
		@apply items-center;
	}
</style>
