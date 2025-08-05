<script lang="ts">
	import dayjs from 'dayjs';
	import * as Select from '$lib/components/ui/select';

	type SplitDatePickerProps = {
		onDateChange?: (
			date: { day: number; month: number; year: number; isoString: string } | null
		) => void;
		initialDate?: Date | { day: number; month: number; year: number } | null;
		minYear?: number;
		maxYear?: number;
		value: string;
		'data-fs-error'?: string; // for form data error
	};

	let {
		initialDate,
		value = $bindable(),
		minYear = 1900,
		maxYear = dayjs().year(),
		onDateChange,
		...restProps
	}: SplitDatePickerProps = $props();

	// Parse initial date if provided
	let initialDay = null;
	let initialMonth = null;
	let initialYear = null;

	if (initialDate) {
		if (initialDate instanceof Date) {
			initialDay = dayjs(initialDate).date();
			initialMonth = dayjs(initialDate).month();
			initialYear = dayjs(initialDate).year();
		} else {
			initialDay = initialDate.day;
			initialMonth = initialDate.month;
			initialYear = initialDate.year;
		}
	}

	let selectedDay = $state<number | null>(initialDay);
	let selectedMonth = $state<number | null>(initialMonth);
	let selectedYear = $state<number | null>(initialYear);

	// Generate arrays for months using dayjs
	const months = Array.from({ length: 12 }, (_, i) => ({
		value: i,
		label: dayjs().month(i).format('MMMM')
	}));

	// Generate arrays for years using dayjs
	const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);

	// Generate arrays for days
	const days = $derived.by(() => {
		if (selectedMonth === null || selectedYear === null) {
			return Array.from({ length: 31 }, (_, i) => i + 1);
		}

		// Use dayjs to get days in month
		const daysInMonth = dayjs().year(selectedYear).month(selectedMonth).daysInMonth();
		return Array.from({ length: daysInMonth }, (_, i) => i + 1);
	});

	function formatValue() {
		if (selectedDay !== null && selectedMonth !== null && selectedYear !== null) {
			return dayjs().year(selectedYear).month(selectedMonth).date(selectedDay).format('YYYY-MM-DD');
		}
		return '';
	}

	// update value
	$effect(() => {
		value = formatValue();
	});

	// Get valid days for the selected month and year
	$effect(() => {
		if (selectedMonth !== null && selectedYear !== null) {
			const daysInMonth = dayjs().year(selectedYear).month(selectedMonth).daysInMonth();
			if (selectedDay !== null && selectedDay > daysInMonth) {
				selectedDay = daysInMonth;
			}
		}
	});

	// trigger onchange callback when date changes
	$effect(() => {
		if (onDateChange) {
			if (selectedDay !== null && selectedMonth !== null && selectedYear !== null) {
				const date = dayjs().year(selectedYear).month(selectedMonth).date(selectedDay);

				onDateChange({
					day: selectedDay,
					month: selectedMonth,
					year: selectedYear,
					isoString: date.toISOString()
				});
			} else {
				onDateChange(null);
			}
		}
	});
</script>

<div class="space-y-2">
	<div class="flex flex-row gap-2">
		<div class="flex-1">
			<Select.Root
				type="single"
				value={selectedDay !== null ? selectedDay.toString() : undefined}
				onValueChange={(value) => (selectedDay = parseInt(value))}
			>
				<Select.Trigger
					class="data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive w-full"
					data-fs-error={restProps['data-fs-error']}
				>
					<span>{selectedDay !== null ? selectedDay : 'Day'}</span>
				</Select.Trigger>
				<Select.Content align="start">
					{#each days as day}
						<Select.Item value={day.toString()}>
							{day}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex-1">
			<Select.Root
				type="single"
				value={selectedMonth !== null ? selectedMonth.toString() : undefined}
				onValueChange={(value) => (selectedMonth = parseInt(value))}
			>
				<Select.Trigger
					class="data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive w-full"
					data-fs-error={restProps['data-fs-error']}
				>
					<span
						>{selectedMonth !== null
							? months.find((m) => m.value === selectedMonth)?.label || 'Month'
							: 'Month'}</span
					>
				</Select.Trigger>
				<Select.Content align="start">
					{#each months as month}
						<Select.Item value={month.value.toString()}>
							{month.label}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>

		<div class="flex-1">
			<Select.Root
				type="single"
				value={selectedYear !== null ? selectedYear.toString() : undefined}
				onValueChange={(value) => (selectedYear = parseInt(value))}
			>
				<Select.Trigger
					class="data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive w-full"
					data-fs-error={restProps['data-fs-error']}
				>
					<span>{selectedYear !== null ? selectedYear : 'Year'}</span>
				</Select.Trigger>
				<Select.Content align="start">
					{#each years as year}
						<Select.Item value={year.toString()}>
							{year}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
	</div>
</div>
