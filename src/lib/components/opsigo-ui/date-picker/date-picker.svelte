<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { cn } from '$lib/utils.js';
	import { parseDate } from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { onMount, untrack } from 'svelte';
	import { useDatePicker } from './date-picker.svelte.js';
	import type { DatePickerProps } from './types';
	import dayjs from 'dayjs';
	let {
		value = $bindable(''),
		minValue = '',
		maxValue,
		otherDate = '',
		disabled = false,
		positionCalendar = 'start',
		triggerClass = ''
	}: DatePickerProps = $props();

	const { state, getMinDtValue, dtFormatDisplay, setVal, setMonthView } = useDatePicker();

	const minDtValue = $derived(getMinDtValue(minValue));

	function setValue(newVal: string) {
		if (value != newVal) {
			value = newVal;
		}
	}

	$effect(() => {
		if (value) {
			state.dtValue = parseDate(value);
		}

		if (minValue) {
			const minDtVal = minDtValue;
			if (minDtVal) {
				var dtVal = untrack(() => state.dtValue);
				var dif = dtVal?.compare(minDtVal);
				if (dif && dif < 0) {
					state.dtValue = minDtVal;
					setVal(state.dtValue.add({ days: 2 }), setValue);
				}
			}
		}
	});

	onMount(() => {
		// kalo ga ada min date, set today aja
		// ga bisa booking kemarin
		if (!minValue) {
			minValue = dayjs().format('YYYY-MM-DD');
		}
	});
</script>

<Popover.Root
	bind:open={state.open}
	onOpenChange={() => {
		if (state.open == true) {
			state.isInitOpen = true;
			setMonthView(value, otherDate);
		}
	}}
>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="ghost"
				{...props}
				class={cn(
					'w-full justify-start pl-2 text-left font-semibold',
					!state.dtValue && 'text-muted-foreground',
					triggerClass
				)}
				{disabled}
			>
				<div class="text-muted-foreground">
					<CalendarIcon class="text-primary mr-1	" />
				</div>

				{state.dtValue ? dtFormatDisplay(state.dtValue) : 'Select a date'}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="date-content w-auto p-0" side="bottom" align={positionCalendar}>
		<Calendar
			bind:value={state.dtValue}
			class="[--cell-size:--spacing(10)]"
			{otherDate}
			type="single"
			weekStartsOn={1}
			onValueChange={() => {
				setVal(state.dtValue, setValue);
				setTimeout(() => {
					state.open = false;
				}, 300);
			}}
			minValue={minDtValue}
			maxValue={maxValue ? parseDate(maxValue) : undefined}
			numberOfMonths={2}
			preventDeselect={true}
			bind:placeholder={state.placeholder}
			onPlaceholderChange={() => {
				// untuk kontrol view calender pada end date agar bulan yang tampil bisa bulan sebelumnya
				// suapay dare range nya lebih keliatan
				if (positionCalendar == 'end') {
					if (state.isInitOpen) {
						if (otherDate) {
							setMonthView(value, otherDate);
							state.isInitOpen = false;
						}
					}
				}
			}}
		/>
	</Popover.Content>
</Popover.Root>

<style>
	:global(.date-content tr[data-calendar-grid-row]) {
		margin-top: 0;
	}
</style>
