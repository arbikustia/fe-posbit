<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		type DateValue,
		getLocalTimeZone,
		DateFormatter
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	// Menerima state dari parent component
	let { state: dataState, triggerClass } = $props();

	// Date formatter
	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	// Fungsi konversi string yyyy-mm-dd ke CalendarDate
	function stringToDate(dateStr: string): CalendarDate | null {
		if (!dateStr) return null;
		try {
			const [year, month, day] = dateStr.split('-').map(Number);
			return new CalendarDate(year, month, day);
		} catch {
			return null;
		}
	}

	// Fungsi konversi CalendarDate ke string yyyy-mm-dd
	function dateToString(date: DateValue | null): string {
		if (!date) return '';
		const year = date.year.toString().padStart(4, '0');
		const month = date.month.toString().padStart(2, '0');
		const day = date.day.toString().padStart(2, '0');
		return `${year}-${month}-${day}`;
	}

	// State untuk Calendar (diambil dari searchModel.domesticStartDate)
	let calendarValue: DateValue | any = $state(
		stringToDate(dataState?.searchModel.domesticStartDate!)
	);

	// Update searchModel.domesticStartDate ketika calendarValue berubah
	$effect(() => {
		dataState.searchModel.domesticStartDate = dateToString(calendarValue);
	});

	let contentRef = $state<HTMLElement | null>(null);
</script>

<div class="grid w-full gap-2">
	<Popover.Root>
		<div class="flex flex-col gap-1">
			<span class="text-sm font-medium text-gray-600">Domestic Start Date</span>
			<Popover.Trigger
				class={cn(
					buttonVariants({ variant: 'outline' }),
					!calendarValue && 'text-muted-foreground',
					'w-full justify-start text-left font-normal',
					triggerClass
				)}
			>
				<CalendarIcon class="mr-2 size-4" />
				{calendarValue ? df.format(calendarValue.toDate(getLocalTimeZone())) : 'Pick a date'}
			</Popover.Trigger>
		</div>
		<Popover.Content bind:ref={contentRef} class="w-auto p-0" align="start">
			<Calendar type="single" bind:value={calendarValue} />
		</Popover.Content>
	</Popover.Root>
</div>