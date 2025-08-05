<!-- modified component -->
<script lang="ts">
	import { Calendar as CalendarPrimitive, type Month } from 'bits-ui';
	import * as Calendar from './index.js';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import type { ButtonVariant } from '../button/button.svelte';
	import { isEqualMonth, parseDate, type DateValue } from '@internationalized/date';
	import type { Snippet } from 'svelte';

	let {
		ref = $bindable(null),
		value = $bindable(),
		placeholder = $bindable(),
		class: className,
		weekdayFormat = 'short',
		buttonVariant = 'ghost',
		captionLayout = 'label',
		locale = 'en-US',
		months: monthsProp,
		years,
		monthFormat: monthFormatProp,
		yearFormat = 'numeric',
		day,
		disableDaysOutsideMonth = false,
		otherDate = '',
		additionalMonthContent,
		...restProps
	}: WithoutChildrenOrChild<CalendarPrimitive.RootProps> & {
		buttonVariant?: ButtonVariant;
		captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
		months?: CalendarPrimitive.MonthSelectProps['months'];
		years?: CalendarPrimitive.YearSelectProps['years'];
		monthFormat?: CalendarPrimitive.MonthSelectProps['monthFormat'];
		yearFormat?: CalendarPrimitive.YearSelectProps['yearFormat'];
		day?: Snippet<
			[
				{
					day: DateValue;
					outsideMonth: boolean;
					highlightedClass: string;
					onHover: () => void;
					onMouseLeave: () => void;
				}
			]
		>;
		additionalMonthContent?: Snippet<[{ month: Month<DateValue> }]>;
		otherDate?: any;
	} = $props();

	let hoverDate = $state<DateValue | null>();
	//let otherDate = '2025-02-25';
	let startDate: DateValue | undefined;
	let endDate: DateValue | undefined;
	let otherDateValue: DateValue | undefined;
	if (otherDate) {
		otherDateValue = parseDate(otherDate);
	}

	const monthFormat = $derived.by(() => {
		if (monthFormatProp) return monthFormatProp;
		if (captionLayout.startsWith('dropdown')) return 'short';
		return 'long';
	});

	if (value && otherDateValue) {
		if (otherDateValue > value) {
			endDate = otherDateValue;
		} else {
			startDate = otherDateValue;
		}
	}

	function dateHighlighted(cellDate: DateValue) {
		if (!otherDateValue) {
			return;
		}
		let hoverCls =
			' hover:before:absolute hover:before:content-[""] hover:before:top-0 hover:before:left-0 hover:before:right-0 hover:before:bottom-0   hover:before:border-primary hover:before:rounded-lg hover:before:z-[2] ';

		let highlightCls =
			'relative z-[1] before:absolute before:content-[""] before:top-1 before:left-[0] before:right-0 before:bottom-1  before:bg-primary/10  before:-z-10 ' +
			'data-[selected]:before:bg-transparent data-[selected]:text-inherit' +
			hoverCls;

		let selectedCls =
			'relative z-[1] before:absolute before:content-[""] before:top-0 before:left-0 before:right-0 before:bottom-0  before:-z-10 before:bg-primary before:rounded-lg !text-primary-foreground ';
		selectedCls += ' after:absolute';
		if (!value) {
			return '';
		}

		if (cellDate.compare(otherDateValue) == 0) {
			return selectedCls;
		}

		// jika start date di set
		// artinya ini datepicker type : END
		if (startDate) {
			// mouse lagi hover
			if (hoverDate) {
				if (hoverDate > cellDate && startDate < cellDate) {
					if (cellDate.compare(value as DateValue) == 0) {
						return hoverCls + ' !bg-primary/10 !border-2  !border-primary !text-primary';
					}
					return highlightCls;
				}
				return '';
			} else if (startDate < cellDate && cellDate < value) {
				return highlightCls;
			}
		}

		// jika end date di set
		// artinya ini datepicker type : START
		if (endDate) {
			if (value < cellDate && cellDate < endDate) {
				return highlightCls;
			}
		}
		return '';
	}

	function onHover(selectedDate: DateValue | null) {
		if (selectedDate) {
			hoverDate = selectedDate;
		}
	}

	function onMouseLeave(selectedDate: DateValue | null) {
		if (selectedDate && hoverDate) {
			if (selectedDate.compare(hoverDate) == 0) {
				hoverDate = null;
			}
		}
	}
</script>

<!--
Discriminated Unions + Destructing (required for bindable) do not
get along, so we shut typescript up by casting `value` to `never`.
-->
<CalendarPrimitive.Root
	bind:value={value as never}
	bind:ref
	bind:placeholder
	{weekdayFormat}
	{disableDaysOutsideMonth}
	class={cn(
		'bg-background group/calendar p-3 [--cell-size:--spacing(8)] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent',
		className
	)}
	{locale}
	{monthFormat}
	{yearFormat}
	{...restProps}
>
	{#snippet children({ months, weekdays })}
		<Calendar.Months>
			<Calendar.Nav>
				<Calendar.PrevButton variant={buttonVariant} />
				<Calendar.NextButton variant={buttonVariant} />
			</Calendar.Nav>
			{#each months as month, monthIndex (month)}
				<Calendar.Month data-month={month.value.toString()}>
					<Calendar.Header>
						<Calendar.Caption
							{captionLayout}
							months={monthsProp}
							{monthFormat}
							{years}
							{yearFormat}
							month={month.value}
							bind:placeholder
							{locale}
							{monthIndex}
						/>
					</Calendar.Header>
					<Calendar.Grid>
						<Calendar.GridHead>
							<Calendar.GridRow class="select-none">
								{#each weekdays as weekday (weekday)}
									<Calendar.HeadCell>
										{weekday.slice(0, 2)}
									</Calendar.HeadCell>
								{/each}
							</Calendar.GridRow>
						</Calendar.GridHead>
						<Calendar.GridBody>
							{#each month.weeks as weekDates (weekDates)}
								<Calendar.GridRow class="mt-2 w-full">
									{#each weekDates as date (date)}
										<Calendar.Cell {date} month={month.value}>
											{#if day}
												{@render day({
													day: date,
													outsideMonth: !isEqualMonth(date, month.value),
													highlightedClass: dateHighlighted(date) ?? '',
													onHover: () => onHover(date),
													onMouseLeave: () => onMouseLeave(date)
												})}
											{:else}
												<Calendar.Day
													class={dateHighlighted(date)}
													onmouseenter={() => onHover(date)}
													onmouseout={() => onMouseLeave(date)}
												/>
											{/if}
										</Calendar.Cell>
									{/each}
								</Calendar.GridRow>
							{/each}
						</Calendar.GridBody>
					</Calendar.Grid>
				</Calendar.Month>
				{#if additionalMonthContent}
					{@render additionalMonthContent({ month: month })}
				{/if}
			{/each}
		</Calendar.Months>
	{/snippet}
</CalendarPrimitive.Root>
