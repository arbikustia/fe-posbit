<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { CalendarDate, getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import type { DateRange } from 'bits-ui';
	import dayjs from 'dayjs';
	import localeData from 'dayjs/plugin/localeData';

	dayjs.extend(localeData);

	type MonthPickerValue = {
		month: number;
		year: number;
	};

	type MonthRangePickerValue = {
		start: MonthPickerValue;
		end: MonthPickerValue;
	};

	type MonthRangePickerProps = {
		value: DateRange;
		maxValue?: DateValue;
		minValue?: DateValue;
		class?: string;
		isSingleView?: boolean;
	};

	let {
		value = $bindable(),
		maxValue = new CalendarDate(dayjs().year() + 10, 12, 32),
		minValue = new CalendarDate(dayjs().year() - 10, 1, 1),
		class: className,
		isSingleView = false
	}: MonthRangePickerProps = $props();

	const months = dayjs.months();

	let currentYear = $state<number>(dayjs().year());

	const monthRangePickerValue: MonthRangePickerValue = $derived.by(() => {
		return {
			start: { month: (value.start?.month ?? 1) - 1, year: value.start?.year! },
			end: { month: (value.end?.month ?? 1) - 1, year: value.end?.year! }
		};
	});

	// Fungsi untuk navigasi tahun
	function previousYear() {
		if (currentYear - 1 > minValue.year) {
			currentYear--;
		}
	}

	function nextYear() {
		if (currentYear < maxValue.year) {
			currentYear++;
		}
	}

	// Fungsi untuk menangani klik bulan
	function handleMonthClick(year: number, month: number) {
		const currentDate = today(getLocalTimeZone());

		if (!value.start || (value.start && value.end)) {
			// Mulai seleksi baru
			value = {
				start: new CalendarDate(year, month + 1, 1),
				end: undefined
			};
		} else if (value.start && !value.end) {
			const endDate = new CalendarDate(year, month + 1, 32);
			// Selesaikan seleksi
			const start = value.start;
			const end =
				currentDate.month === endDate.month && currentDate.year === endDate.year
					? currentDate
					: new CalendarDate(year, month + 1, 32);

			// Pastikan start selalu lebih awal dari end
			if (compareMonths(start, end) > 0) {
				value = {
					start: end.set({ day: 1 }),
					end: start.set({
						day:
							currentDate.month === endDate.month && currentDate.year === endDate.year
								? currentDate.day
								: 32
					})
				};
			} else {
				value = { start, end };
			}
		}
	}

	// Fungsi untuk membandingkan dua bulan
	function compareMonths(month1: MonthPickerValue, month2: MonthPickerValue) {
		if (month1.year !== month2.year) {
			return month1.year - month2.year;
		}
		return month1.month - month2.month;
	}

	// Fungsi untuk mengecek apakah bulan dalam range
	function isInRange(year: number, month: number) {
		if (!monthRangePickerValue.start) return false;

		const current = { year, month };
		const start = monthRangePickerValue.start;
		const end = monthRangePickerValue.end;

		if (!end) {
			return compareMonths(current, start) === 0;
		}

		return compareMonths(current, start) >= 0 && compareMonths(current, end) <= 0;
	}

	// Fungsi untuk mengecek apakah bulan adalah start atau end
	function isRangeEdge(year: number, month: number) {
		if (!monthRangePickerValue.start) return false;

		const current = { year, month };
		const start = monthRangePickerValue.start;
		const end = monthRangePickerValue.end;

		return compareMonths(current, start) === 0 || (end && compareMonths(current, end) === 0);
	}

	function isDisabledRange(year: number, month: number) {
		return (
			(year >= maxValue.year && month > maxValue.month - 1) ||
			(year <= minValue.year && month < minValue.month - 1)
		);
	}
</script>

<div class={cn('relative flex flex-col gap-4 p-3 md:flex-row', className)}>
	<!-- Header dengan navigasi tahun -->
	<div class="absolute left-0 right-0 flex items-center justify-between px-3">
		<Button variant="ghost" onclick={previousYear} disabled={currentYear - 1 <= minValue.year}>
			<ChevronLeft />
		</Button>

		<Button variant="ghost" onclick={nextYear} disabled={currentYear >= maxValue.year}>
			<ChevronRight />
		</Button>
	</div>

	<!-- Tahun pertama -->
	{#if !isSingleView}
		<div class="flex flex-col">
			<div class="flex h-9 w-full items-center justify-center">
				<h2 class="font-semibold text-gray-800">{currentYear - 1}</h2>
			</div>

			<div class="grid grid-cols-3 gap-y-4">
				{#each months as monthName, index}
					<Button
						variant="ghost"
						onclick={() => handleMonthClick(currentYear - 1, index)}
						class={cn('px-1', {
							'bg-accent rounded-none': isInRange(currentYear - 1, index),
							'bg-primary! text-primary-foreground! rounded-md': isRangeEdge(currentYear - 1, index)
						})}
						disabled={isDisabledRange(currentYear - 1, index)}
					>
						{monthName}
					</Button>
				{/each}
			</div>
		</div>
	{/if}

	<!-- Tahun kedua -->
	<div class="flex flex-col">
		<div class="flex h-9 w-full items-center justify-center">
			<h2 class="font-semibold text-gray-800">{currentYear}</h2>
		</div>
		<div class="grid grid-cols-3 gap-y-4">
			{#each months as monthName, index}
				<Button
					variant="ghost"
					onclick={() => handleMonthClick(currentYear, index)}
					class={cn('px-1', {
						'bg-accent rounded-none': isInRange(currentYear, index),
						'bg-primary! text-primary-foreground! rounded-md': isRangeEdge(currentYear, index)
					})}
					disabled={isDisabledRange(currentYear, index)}
				>
					{monthName}
				</Button>
			{/each}
		</div>
	</div>
</div>
