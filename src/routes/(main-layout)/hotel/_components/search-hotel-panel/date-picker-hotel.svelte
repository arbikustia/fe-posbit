<script lang="ts">
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import { Button } from '$lib/components/ui/form';
	import Icon from '@iconify/svelte';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command';
	import dayjs from 'dayjs';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { cn } from '$lib/utils';

	let { dateRange = $bindable(), variant, isEndDate = false } = $props();

	const countDays = $derived.by(() => {
		if (dateRange.start && dateRange.end) {
			const start = new Date(dateRange.start);
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

{#if variant == 'combination'}
	<Popover.Root>
		<div class="relative flex w-full flex-col gap-1">
			<Button variant="secondary" class="h-11 w-full p-0">
				<OSGDatePicker
					bind:value={dateRange.start}
					otherDate={dateRange.end}
					class="text-primary h-11 px-2 py-0 "
					iconClass="text-primary"
				/>
			</Button>

			<div class="px-2">
				{#if countDays}
					<Button variant="ghost" class="absolute right-2 top-7 rounded-lg border bg-white  ">
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<Popover.Trigger class="text-primary h- flex items-center justify-center gap-1">
										{countDays}<Icon icon="tabler:moon" width="20" height="20" />
									</Popover.Trigger>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>{countDays} nights</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					</Button>
				{/if}
			</div>
			<Button variant="secondary" class="h-11 w-full p-0">
				<OSGDatePicker
					bind:value={dateRange.end}
					minValue={dateRange.start}
					otherDate={dateRange.start}
					positionCalendar="end"
					class="text-primary h-8 px-2 py-0"
					iconClass="text-primary"
				/>
			</Button>

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
		</div>
	</Popover.Root>
{:else if variant == 'default'}
	<div class="relative w-full">
		<div class="mb-1 grid grid-cols-2">
			{#if variant == 'default'}
				<label class="text-sm font-medium text-gray-600" for="start-date">Check-in Date</label>
				<label
					for="end-date"
					class={['text-sm font-medium text-gray-600', { 'opacity-0': !isEndDate }]}
				>
					Check-out Date
				</label>
			{/if}
		</div>
		<div
			class="shadow-xs grid h-11 min-w-[350px] grid-cols-7 rounded-lg border border-gray-200 p-1"
		>
			<div id="start-date" class="col-span-3">
				<OSGDatePicker bind:value={dateRange.start} class="h-8.5" />
			</div>
			<div id="end-date" class="col-span-3">
				{#if isEndDate === false}
					<Button
						class="text-muted-foreground w-full h-8.5"
						variant="ghost"
						onclick={() => (isEndDate = true)}
					>
						Add Check-out Date
					</Button>
				{:else}
					<OSGDatePicker
						bind:value={dateRange.end}
						positionCalendar="end"
						minValue={dateRange.start}
						otherDate={dateRange.start}
						class="h-8.5"
					/>
				{/if}
			</div>
			<Popover.Root>
				<Popover.Trigger>
					<Button
						variant="secondary"
						class="text-primary col-span-1 ml-1  h-8 w-10 gap-1 space-x-1 px-3 text-xs"
						>{countDays}<Icon icon="tabler:moon" width="20" height="20" />
					</Button>
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
	</div>
{:else}
	<div class="relative w-full">
		<div class="mb-1 grid grid-cols-2">
			{#if variant == 'default'}
				<label class="text-sm font-medium text-gray-600" for="start-date">Check-in Date</label>
				<label
					for="end-date"
					class={['text-sm font-medium text-gray-600', { 'opacity-0': !isEndDate }]}
				>
					Check-out Date
				</label>
			{/if}
		</div>
		<div
			class="shadow-xs grid h-9 min-w-[350px] grid-cols-7 gap-1 rounded-lg border border-gray-200 p-0"
		>
			<div id="start-date" class="col-span-3 h-9">
				<OSGDatePicker bind:value={dateRange.start} class="h-8.5" />
			</div>
			<div id="end-date" class="col-span-3 h-9">
				{#if isEndDate === false}
					<Button
						class="text-muted-foreground w-full"
						variant="ghost"
						onclick={() => (isEndDate = true)}
					>
						Add Check-out Date
					</Button>
				{:else}
					<OSGDatePicker
						bind:value={dateRange.end}
						positionCalendar="end"
						minValue={dateRange.start}
						otherDate={dateRange.start}
						class="h-8.5"
					/>
				{/if}
			</div>
			<Popover.Root>
				<Popover.Trigger>
					<Button
						variant="secondary"
						class="text-primary h-8.5 col-span-1 mb-1  w-full gap-1  text-xs"
						>{countDays}<Icon icon="tabler:moon" width="20" height="20" />
					</Button>
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
	</div>
{/if}
<!-- Bagian template tetap sama seperti sebelumnya -->
