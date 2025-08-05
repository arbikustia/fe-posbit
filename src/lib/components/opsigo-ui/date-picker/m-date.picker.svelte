<script lang="ts">
	import { Close } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Calendar from '$lib/components/ui/calendar';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils.js';
	import {
		CalendarDate,
		getDayOfWeek,
		getLocalTimeZone,
		parseDate,
		today,
		type DateValue
	} from '@internationalized/date';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import dayjs from 'dayjs';
	import localeData from 'dayjs/plugin/localeData';
	import { onMount, untrack } from 'svelte';
	import { MOSGAppBar } from '../m-app-bar/index.js';
	import { useDatePicker } from './date-picker.svelte.js';
	import type { DatePickerProps } from './types';
	import { fade } from 'svelte/transition';
	import { holidaysData } from './dummy';

	dayjs.extend(localeData);

	let {
		value = $bindable(''),
		minValue = '',
		maxValue,
		otherDate = '',
		disabled = false,
		class: className,
		iconClass,
		title = 'Select Date'
	}: DatePickerProps & { title?: string } = $props();

	const { state: comState, getMinDtValue, dtFormatDisplay, setVal } = useDatePicker();

	let stickyMonth = $state<string>();

	const minDtValue = $derived(getMinDtValue(minValue));

	const numberOfMonthView = $derived.by(() => {
		const maxDtValue = maxValue
			? parseDate(maxValue)
			: minValue
				? parseDate(minValue).add({ months: 13 })
				: today(getLocalTimeZone()).add({ months: 13 });
		return dayjs(maxDtValue.toString()).diff(dayjs(minDtValue?.toString()), 'months');
	});

	const weekdays = [...dayjs.weekdays().slice(1), dayjs.weekdays()[0]]; // weekdays start from monday

	function setValue(newVal: string) {
		if (value != newVal) {
			value = newVal;
		}
	}

	function scrollToSelectedDate(date: string) {
		const el = document.querySelector(`[data-value="${date}"]`);
		el?.scrollIntoView({ block: 'center' });
	}

	function getHolidayDataByMonth(date: DateValue) {
		const year = date.year.toString();

		const holidays = holidaysData[year as keyof typeof holidaysData];

		return holidays.filter((item) => parseDate(item.date).month === date.month);
	}

	function isHolidayDateCheck(date: DateValue) {
		const year = date.year.toString();

		const holidays = holidaysData[year as keyof typeof holidaysData];

		return !!holidays.find((item) => parseDate(item.date).toString() === date.toString());
	}

	$effect(() => {
		if (value) {
			comState.dtValue = parseDate(value);
		}

		if (minValue) {
			const minDtVal = minDtValue;
			if (minDtVal) {
				var dtVal = untrack(() => comState.dtValue);
				var dif = dtVal?.compare(minDtVal);
				if (dif && dif < 0) {
					comState.dtValue = minDtVal;
					setVal(comState.dtValue.add({ days: 2 }), setValue);
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

	$effect(() => {
		if (comState.open) {
			const root = document.querySelector('.m-date-picker-container');
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							const date = entry.target.getAttribute('data-month');
							stickyMonth = date !== 'none' ? dayjs(date).format('MMMM YYYY') : undefined;
						}
					});
				},
				{
					root: root,
					rootMargin: '0px 0px -95% 0px',
					threshold: 0
				}
			);

			setTimeout(() => {
				const monthElements = document.querySelectorAll('[data-month]');
				monthElements.forEach((el) => {
					observer.observe(el);
				});
			});

			return () => observer.disconnect();
		}
	});
</script>

<Drawer.Root
	bind:open={comState.open}
	onOpenChange={() => {
		if (comState.open == true) {
			comState.isInitOpen = true;
		}

		if (value) {
			setTimeout(() => {
				scrollToSelectedDate(value);
			}, 100);
		}
	}}
>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<Button
				variant="ghost"
				class={cn(
					'w-full justify-start pl-2 text-left font-semibold',
					{
						'text-muted-foreground': !comState.dtValue
					},
					className
				)}
				{...props}
				{disabled}
			>
				<div class="text-muted-foreground">
					<CalendarIcon class={cn('mr-1', iconClass)} />
				</div>

				{comState.dtValue ? dtFormatDisplay(comState.dtValue) : 'Select a date'}
			</Button>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content
		class="m-date-content border-0! w-auto p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="bg-primary text-primary-foreground static h-fit max-w-full">
			{#snippet leftAction()}
				<button
					onclick={() => {
						comState.open = false;
					}}
				>
					<Close />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="text-lg font-semibold">{title}</div>
			{/snippet}
		</MOSGAppBar>
		<div class="m-date-picker-container overflow-y-auto">
			<div class="my-8" data-month="none"></div>
			{#if stickyMonth}
				<div
					class="fixed top-20 z-10 w-full bg-white px-4 py-2 text-sm font-semibold shadow"
					transition:fade
				>
					{stickyMonth}
				</div>
			{/if}
			<div class="fixed top-12 z-10 w-full border-b bg-white py-2">
				<table
					class="w-full border-collapse gap-1 [--cell-size:clamp(0px,calc(100vw/7.5),58px)]"
					tabindex="-1"
					role="grid"
				>
					<thead class="flex justify-center">
						<tr class="flex">
							{#each weekdays as weekday, i}
								<th
									class={cn('w-(--cell-size) rounded-md text-[0.8rem] font-semibold', {
										'text-red-400': i === weekdays.length - 1
									})}
								>
									{weekday.slice(0, 3)}
								</th>
							{/each}
						</tr>
					</thead>
				</table>
			</div>

			<Calendar.Calendar
				class="mx-auto w-full [--cell-size:clamp(0px,calc(100vw/7.5),58px)]"
				bind:value={comState.dtValue}
				{otherDate}
				type="single"
				weekStartsOn={1}
				onValueChange={() => {
					setVal(comState.dtValue, setValue);
					setTimeout(() => {
						comState.open = false;
					}, 300);
				}}
				minValue={minDtValue}
				maxValue={maxValue ? parseDate(maxValue) : undefined}
				disableDaysOutsideMonth
				numberOfMonths={numberOfMonthView}
				preventDeselect={true}
				placeholder={minDtValue}
			>
				{#snippet day({ day, outsideMonth, highlightedClass })}
					{#if !outsideMonth}
						{@const isSunday = getDayOfWeek(day, 'id-ID') === 0}
						{@const isHoliday = isHolidayDateCheck(day)}
						<Calendar.Day
							class={cn(highlightedClass, 'text-base', {
								'text-red-400': isSunday || isHoliday
							})}
						/>
					{/if}
				{/snippet}

				{#snippet additionalMonthContent({ month })}
					{@const holidays = getHolidayDataByMonth(month.value)}
					<ul class="scrollbar-hide flex items-center overflow-x-auto whitespace-nowrap pl-2">
						{#each holidays as holiday, i}
							{@const isLast = i === holidays.length - 1}
							<li class="text-muted-foreground text-xs">
								{parseDate(holiday.date).day}
								{holiday.en}
								{#if !isLast}
									<span
										class="bg-muted-foreground mx-2 inline-block size-0.5 rounded-full align-middle"
									></span>
								{/if}
							</li>
						{/each}
					</ul>
				{/snippet}
			</Calendar.Calendar>
		</div>
	</Drawer.Content>
</Drawer.Root>

<style>
	@reference '$appCss';
	:global(.m-date-content div[data-calendar-root] div:nth-child(2)) {
		@apply md:flex-col;
	}
	:global(.m-date-content table[data-calendar-grid]) {
		@apply items-center;
	}

	:global(.m-date-content nav) {
		@apply hidden;
	}

	:global(.m-date-content header[data-calendar-header]) {
		@apply top-9 h-fit justify-start pl-1 text-lg;
	}

	:global(.m-date-content thead[data-calendar-grid-head]) {
		@apply hidden;
	}

	:global(.m-date-content table[data-calendar-grid]) {
		@apply mt-0;
	}
</style>
