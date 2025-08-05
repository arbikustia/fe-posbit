<script lang="ts">
	import dayjs from 'dayjs';
	import { onMount, unmount } from 'svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ChevronDown } from '@lucide/svelte';

	type WheelDatePickerProps = {
		title: string;
		minDate?: string; // date format YYYY-MM-DD
		maxDate?: string; // date format YYYY-MM-DD
		value: string; // date format YYYY-MM-DD
		'data-fs-error'?: string; // for form data error
		className?: string;
	};

	let {
		title,
		value = $bindable(),
		minDate,
		maxDate,
		className,
		...restProps
	}: WheelDatePickerProps = $props();

	let open = $state(false);

	let selectedValue = $state<string>(
		value !== '' ? value : maxDate || dayjs().format('YYYY-MM-DD')
	);

	// Parse minDate and maxDate to dayjs objects if they exist
	const minDateObj = $derived(minDate ? dayjs(minDate) : null);
	const maxDateObj = $derived(maxDate ? dayjs(maxDate) : null);

	// separated selectedValue
	const selectedDay = $derived(dayjs(selectedValue).date());
	const selectedMonth = $derived(dayjs(selectedValue).month());
	const selectedYear = $derived(dayjs(selectedValue).year());

	let scrollTimeout: NodeJS.Timeout;

	// Initialize current date with dayjs
	const currentDate = dayjs();

	const yearOptions = $derived.by(() => {
		let minYear = minDateObj ? minDateObj.year() : currentDate.year() - 7;
		let maxYear = maxDateObj ? maxDateObj.year() : currentDate.year() + 2;

		// Ensure we have at least a few years to choose from
		if (maxYear - minYear < 5) {
			maxYear = minYear + 5;
		}

		return Array.from({ length: maxYear - minYear + 1 }, (_, i) => minYear + i);
	});

	// Generate month options based on selected year and min/max constraints
	const monthOptionsFiltered = $derived.by(() => {
		let minMonth = 0;
		let maxMonth = 11;

		if (minDateObj && minDateObj.year() === selectedYear) {
			minMonth = minDateObj.month();
		}

		if (maxDateObj && maxDateObj.year() === selectedYear) {
			maxMonth = maxDateObj.month();
		}
		return Array.from({ length: maxMonth - minMonth + 1 }, (_, i) => {
			const monthIndex = minMonth + i;
			return {
				value: monthIndex,
				label: dayjs().month(monthIndex).format('MMMM')
			};
		});
	});

	// Generate day options based on selected year, month and min/max constraints
	const dayOptionsFiltered = $derived.by(() => {
		const daysInMonth = dayjs(`${selectedYear}-${selectedMonth + 1}-01`).daysInMonth();

		let minDay = 1;
		let maxDay = daysInMonth;

		if (minDateObj && minDateObj.year() === selectedYear && minDateObj.month() === selectedMonth) {
			minDay = minDateObj.date();
		}

		if (maxDateObj && maxDateObj.year() === selectedYear && maxDateObj.month() === selectedMonth) {
			maxDay = maxDateObj.date();
		}
		return Array.from({ length: maxDay - minDay + 1 }, (_, i) => minDay + i);
	});

	function setSelectedValue(unit: dayjs.UnitType, val: number) {
		let newDate = dayjs(selectedValue).set(unit, val);

		// Ensure the date is within min and max constraints
		if (minDateObj && newDate.isBefore(minDateObj, 'day')) {
			newDate = minDateObj;
		}

		if (maxDateObj && newDate.isAfter(maxDateObj, 'day')) {
			newDate = maxDateObj;
		}

		selectedValue = newDate.format('YYYY-MM-DD');

		// Re-initialize scroll for other wheels as their options might have changed
		setTimeout(initializeScroll, 0);
	}

	// Handle scroll to create wheel effect
	function handleScroll(e: any, type: string) {
		const container = e.currentTarget;
		const itemHeight = 48; // Height of each item in pixels

		// Snap to nearest position after scrolling stops
		clearTimeout(scrollTimeout);

		scrollTimeout = setTimeout(() => {
			const scrollTop = container.scrollTop;
			const index = Math.round(scrollTop / itemHeight);

			container.scrollTo({
				top: index * itemHeight,
				behavior: 'smooth'
			});

			// Update selected value based on wheel type
			if (type === 'day' && dayOptionsFiltered[index] !== undefined) {
				setSelectedValue('date', dayOptionsFiltered[index]);
			} else if (type === 'month' && monthOptionsFiltered[index] !== undefined) {
				setSelectedValue('month', monthOptionsFiltered[index].value);
			} else if (type === 'year' && yearOptions[index] !== undefined) {
				setSelectedValue('year', yearOptions[index]);
			}
		}, 100);
	}

	// Validate initial value against min and max constraints
	function validateInitialValue() {
		const current = dayjs(selectedValue);

		if (minDateObj && current.isBefore(minDateObj, 'day')) {
			selectedValue = minDate!;
		}

		if (maxDateObj && current.isAfter(maxDateObj, 'day')) {
			selectedValue = maxDate!;
		}
	}

	function initializeScroll() {
		// Set initial scroll positions based on selected values
		setTimeout(() => {
			const dayIndex = dayOptionsFiltered.indexOf(selectedDay);
			const monthIndex = monthOptionsFiltered.findIndex((m) => m.value === selectedMonth);
			const yearIndex = yearOptions.indexOf(selectedYear);

			const dayContainer = document.getElementById('day-container');
			const monthContainer = document.getElementById('month-container');
			const yearContainer = document.getElementById('year-container');

			if (dayContainer && dayIndex >= 0) {
				dayContainer.scrollTop = dayIndex * 48;
			}

			if (monthContainer && monthIndex >= 0) {
				monthContainer.scrollTop = monthIndex * 48;
			}

			if (yearContainer && yearIndex >= 0) {
				yearContainer.scrollTop = yearIndex * 48;
			}
		}, 0);
	}

	function onSave() {
		value = selectedValue;
		open = false;
	}
</script>

<Drawer.Root
	bind:open
	onOpenChange={(open) => {
		if (open) {
			validateInitialValue();
			initializeScroll();
		}
	}}
>
	<Drawer.Trigger type="button" class="w-full">
		<div
			class={cn(
				'h-9 w-full rounded-md border border-input bg-white shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring',
				//data error
				'data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive',
				className
			)}
			data-fs-error={restProps['data-fs-error']}
		>
			<div class="flex h-full items-center justify-between px-3 text-sm">
				<p class={cn({ 'text-muted-foreground': value === '' })}>
					{value !== '' ? dayjs(value).format('DD MMMM YYYY') : title}
				</p>

				<ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
			</div>
		</div>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>{title}</Drawer.Title>
		</Drawer.Header>
		<div class="pb-14 pt-2">
			<div class="mb-4 flex px-1 text-center">
				<div class="flex-1 font-semibold">Day</div>
				<div class="flex-1 font-semibold">Month</div>
				<div class="flex-1 font-semibold">Year</div>
			</div>

			<div class="relative flex h-52">
				<!-- Highlight for selected value -->
				<div
					class="pointer-events-none absolute left-0 right-0 top-1/2 h-12 -translate-y-1/2 transform border-b border-t border-gray-200"
				></div>

				<!-- Day Picker -->
				<div
					id="day-container"
					class="scrollbar-hide flex-1 snap-y overflow-y-scroll"
					onscroll={(e) => handleScroll(e, 'day')}
				>
					<div class="h-20"></div>
					{#each dayOptionsFiltered as day}
						<div class="flex h-12 items-center justify-center" style="scroll-snap-align: center;">
							<span class={day === selectedDay ? 'font-medium text-black' : 'text-gray-300'}>
								{day}
							</span>
						</div>
					{/each}
					<div class="h-20"></div>
				</div>

				<!-- Month Picker -->
				<div
					id="month-container"
					class="scrollbar-hide flex-1 snap-y overflow-y-scroll"
					onscroll={(e) => handleScroll(e, 'month')}
				>
					<div class="h-20"></div>
					{#each monthOptionsFiltered as month}
						<div class="flex h-12 items-center justify-center" style="scroll-snap-align: center;">
							<span
								class={month.value === selectedMonth ? 'font-medium text-black' : 'text-gray-300'}
							>
								{month.label}
							</span>
						</div>
					{/each}
					<div class="h-20"></div>
				</div>

				<!-- Year Picker -->
				<div
					id="year-container"
					class="scrollbar-hide flex-1 snap-y overflow-y-scroll"
					onscroll={(e) => handleScroll(e, 'year')}
				>
					<div class="h-20"></div>
					{#each yearOptions as year}
						<div class="flex h-12 items-center justify-center" style="scroll-snap-align: center;">
							<span class={year === selectedYear ? 'font-medium text-black' : 'text-gray-300'}>
								{year}
							</span>
						</div>
					{/each}
					<div class="h-20"></div>
				</div>
			</div>
		</div>

		<div class="absolute bottom-0 w-full border-t bg-white p-4 shadow-sm">
			<Button class="w-full" onclick={onSave}>Save</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
