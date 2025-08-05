<script lang="ts">
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import { Button } from '$lib/components/ui/form';
	import Icon from '@iconify/svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command';
	import dayjs from 'dayjs';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	// Menerima state dari parent component

	let { dateRange = $bindable(), variant, isEndDate } = $props();

	const countDays = $derived.by(() => {
		if (dateRange?.start && dateRange.end) {
			const start = new Date(dateRange?.start);
			const end = new Date(dateRange.end);
			const diffInMs: any = Number(end) - Number(start);
			const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
			return `${diffInDays + 1}`;
		}
	});
	function addDays(date: Date, days: number): Date {
		const result = new Date(date);
		result.setDate(result.getDate() + days);
		return result;
	}

	function setEndDate(days: number) {
		if (dateRange.start) {
			const startDate = new Date(dateRange.start);
			const endDate = addDays(startDate, days - 1); // -1 untuk inklusif
			dateRange = { ...dateRange, end: endDate };
			isEndDate = true;
		}
		dateRange.end = dayjs(dateRange.start)
			.add(days - 1, 'day')
			.format('YYYY-MM-DD');
	}
</script>

<div class="relative w-full">
	<div class="mb-1 grid grid-cols-2">
		{#if variant == 'default'}
			<label class="text-sm font-medium text-gray-600" for="start-date">Start Date</label>
			<label
				for="end-date"
				class={['text-sm font-medium text-gray-600', { 'opacity-0': !isEndDate }]}
			>
				End Date
			</label>
		{/if}
	</div>
	{#if variant == 'combination'}
		<div class="relative rounded-md border w-full">
			<div class="py-1">
				<p class="px-2 text-xs text-gray-500">Start Date</p>
				<OSGDatePicker
					class="h-8  py-0"
					iconClass="text-primary"
					otherDate={dateRange.end}
					bind:value={dateRange.start}
				/>
			</div>

			<div class="px-2">
				<Separator />
				<p class="absolute right-5 top-12 bg-white px-2 text-sm text-gray-500">{countDays} days</p>
			</div>
			<div class="py-1">
				<p class="px-2 text-xs text-gray-500">End Date</p>
				<OSGDatePicker
					bind:value={dateRange.end}
					positionCalendar="end"
					minValue={dateRange?.start}
					otherDate={dateRange?.start}
					class="h-8  py-0"
					iconClass="text-primary"
				/>
			</div>
		</div>
	{:else}
		<div class="shadow-xs grid min-w-[350px] grid-cols-7 rounded-lg border border-gray-200 p-1">
			<div id="start-date" class="col-span-3">
				<OSGDatePicker bind:value={dateRange.start} />
			</div>
			<div id="end-date" class="col-span-3">
				{#if isEndDate === false}
					<Button
						class="text-muted-foreground w-full"
						variant="ghost"
						onclick={() => (isEndDate = true)}
					>
						Add End Date
					</Button>
				{:else}
					<OSGDatePicker
						bind:value={dateRange.end}
						positionCalendar="end"
						minValue={dateRange?.start}
						otherDate={dateRange?.start}
					/>
				{/if}
			</div>
			<Popover.Root>
				<Popover.Trigger>
					<Tooltip.Provider>
						<Tooltip.Root>
							<Tooltip.Trigger>
								<Button
									variant="secondary"
									class="text-primary col-span-1 ml-1 h-9 w-10 gap-1 space-x-1 px-3 text-xs"
									>{countDays}
								</Button>
							</Tooltip.Trigger>
							<Tooltip.Content>
								<p>{countDays} days</p>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				</Popover.Trigger>
				<Popover.Content class="flex max-h-44 w-20 flex-col p-1">
					<Command.Root shouldFilter={false}>
						<Command.List class="custom-scrollbar">
							{#each Array.from({ length: 365 }, (_, i) => i + 1) as day}
								<Button class="w-full" variant="ghost" onclick={() => setEndDate(day)}>
									{day}
								</Button>
							{/each}
						</Command.List>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
		</div>
	{/if}
</div>
