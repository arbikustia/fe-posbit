<script lang="ts">
	import { HighlightCard } from './_components/highlight-card';
	import { ChartVisitors } from './_components/chart-visitors';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import type { DateRange } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let value: DateRange = $state({
		start: new CalendarDate(2022, 1, 20),
		end: new CalendarDate(2022, 1, 20).add({ days: 20 })
	});

	let startValue: DateValue | undefined = $state(undefined);
</script>

<svelte:head>
	<title>Dashboard | Bantuit</title>
</svelte:head>

<div class="container flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-4">
		<div class="grid gap-2 max-w-65">
			<Popover.Root>
				<Popover.Trigger
					class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
				>
					<CalendarIcon class="mr-2 size-4" />
					{#if value && value.start}
						{#if value.end}
							{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
								value.end.toDate(getLocalTimeZone())
							)}
						{:else}
							{df.format(value.start.toDate(getLocalTimeZone()))}
						{/if}
					{:else if startValue}
						{df.format(startValue.toDate(getLocalTimeZone()))}
					{:else}
						Pick a date
					{/if}
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" align="start">
					<RangeCalendar
						bind:value
						onStartValueChange={(v) => {
							startValue = v;
						}}
						numberOfMonths={2}
					/>
				</Popover.Content>
			</Popover.Root>
		</div>
		<div class="flex flex-col gap-4 md:gap-6">
			<HighlightCard />
			<ChartVisitors />
		</div>
	</div>
</div>
