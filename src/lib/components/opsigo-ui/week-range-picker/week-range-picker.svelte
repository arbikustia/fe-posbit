<script lang="ts">
	import { RangeCalendar as RangeCalendarPrimitive } from 'bits-ui';
	import * as RangeCalendar from '$lib/components/ui/range-calendar';
	import { cn, type WithoutChildrenOrChild } from '$lib/utils.js';
	import type { ButtonVariant } from '$lib/components/ui/button/index.js';
	import type { Snippet } from 'svelte';
	import { isEqualMonth, type DateValue } from '@internationalized/date';

	let {
		ref = $bindable(null),
		value = $bindable(),
		placeholder = $bindable(),
		weekdayFormat = 'short',
		class: className,
		buttonVariant = 'ghost',
		captionLayout = 'label',
		locale = 'en-US',
		months: monthsProp,
		years,
		monthFormat: monthFormatProp,
		yearFormat = 'numeric',
		day,
		disableDaysOutsideMonth = false,
		...restProps
	}: WithoutChildrenOrChild<RangeCalendarPrimitive.RootProps> & {
		buttonVariant?: ButtonVariant;
		captionLayout?: 'dropdown' | 'dropdown-months' | 'dropdown-years' | 'label';
		months?: RangeCalendarPrimitive.MonthSelectProps['months'];
		years?: RangeCalendarPrimitive.YearSelectProps['years'];
		monthFormat?: RangeCalendarPrimitive.MonthSelectProps['monthFormat'];
		yearFormat?: RangeCalendarPrimitive.YearSelectProps['yearFormat'];
		day?: Snippet<[{ day: DateValue; outsideMonth: boolean }]>;
	} = $props();

	const monthFormat = $derived.by(() => {
		if (monthFormatProp) return monthFormatProp;
		if (captionLayout.startsWith('dropdown')) return 'short';
		return 'long';
	});

	function excludeDisabledDate(weekDates: DateValue[]) {
		const maxValue = restProps.maxValue;
		if (maxValue) {
			return weekDates.filter((weekDate) => weekDate.compare(maxValue) <= 0);
		}

		return weekDates;
	}
	function isRangeStart(weekDates: DateValue[], date: DateValue) {
		const weeks = excludeDisabledDate(weekDates);
		const first = weeks?.[0]?.day;
		return date.day === first;
	}

	function isRangeEnd(weekDates: DateValue[], date: DateValue) {
		const weeks = excludeDisabledDate(weekDates);
		const last = weeks?.[weeks.length - 1]?.day;
		return date.day === last;
	}

	function isInRange(weekDates: DateValue[], date: DateValue) {
		const weeks = excludeDisabledDate(weekDates);

		return weeks.map((item) => item.day).includes(date.day);
	}

	function hasRangeOnPreviousMonth(weekDates: DateValue[], dateIdx: number) {
		return weekDates[dateIdx - 1] && weekDates[dateIdx - 1].month !== weekDates[dateIdx].month;
	}

	function hasRangeOnNextMonth(weekDates: DateValue[], dateIdx: number) {
		return weekDates[dateIdx + 1] && weekDates[dateIdx + 1].month !== weekDates[dateIdx].month;
	}
</script>

<RangeCalendarPrimitive.Root
	bind:ref
	bind:value
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
		<RangeCalendar.Months>
			<RangeCalendar.Nav>
				<RangeCalendar.PrevButton variant={buttonVariant} />
				<RangeCalendar.NextButton variant={buttonVariant} />
			</RangeCalendar.Nav>
			{#each months as month, monthIndex (month)}
				<RangeCalendar.Month>
					<RangeCalendar.Header>
						<RangeCalendar.Caption
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
					</RangeCalendar.Header>

					<RangeCalendar.Grid>
						<RangeCalendar.GridHead>
							<RangeCalendar.GridRow class="select-none">
								{#each weekdays as weekday (weekday)}
									<RangeCalendar.HeadCell>
										{weekday.slice(0, 2)}
									</RangeCalendar.HeadCell>
								{/each}
							</RangeCalendar.GridRow>
						</RangeCalendar.GridHead>
						<RangeCalendar.GridBody>
							{#each month.weeks as weekDates (weekDates)}
								<RangeCalendar.GridRow class="group mt-2 w-full">
									{#each weekDates as date, dateIdx (date)}
										{@const equalMonth = isEqualMonth(date, month.value)}
										<RangeCalendar.Cell
											{date}
											month={month.value}
											class={cn({
												'group-hover:bg-accent cursor-pointer border-y':
													isInRange(weekDates, date) && equalMonth,
												'rounded-l-md border-l': isRangeStart(weekDates, date) && equalMonth,
												'rounded-r-md border-r': isRangeEnd(weekDates, date) && equalMonth,
												'border-l':
													hasRangeOnPreviousMonth(weekDates, dateIdx) &&
													isInRange(weekDates, date) &&
													equalMonth,
												'border-r':
													hasRangeOnNextMonth(weekDates, dateIdx) &&
													isInRange(weekDates, date) &&
													equalMonth
											})}
											onclick={() => {
												const weeks = excludeDisabledDate(weekDates);
												if (weeks.length > 0) {
													value = {
														start: weeks[0],
														end: weeks[weeks.length - 1]
													};
												}
											}}
										>
											{#if equalMonth}
												<RangeCalendar.Day
													class="[&[data-today]:not([data-selected])]:text-primary pointer-events-none hover:bg-transparent [&[data-today]:not([data-selected])]:bg-transparent"
												/>
											{/if}
										</RangeCalendar.Cell>
									{/each}
								</RangeCalendar.GridRow>
							{/each}
						</RangeCalendar.GridBody>
					</RangeCalendar.Grid>
				</RangeCalendar.Month>
			{/each}
		</RangeCalendar.Months>
	{/snippet}
</RangeCalendarPrimitive.Root>
