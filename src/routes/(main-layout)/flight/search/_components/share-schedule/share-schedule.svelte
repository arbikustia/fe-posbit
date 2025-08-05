<script lang="ts">
	import { Share } from '$lib/components/icons';
	import { OSGHtmlToImage } from '$lib/components/opsigo-ui/html-to-image';
	import { buttonVariants } from '$lib/components/ui/button/';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Label } from '$lib/components/ui/label/';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet/';
	import { displayDate } from '$lib/helpers/date-helper';
	import { ChevronUp, Clipboard, Image } from '@lucide/svelte';
	import ShareScheduleItem from './share-schedule-item.svelte';
	import { useShareSchedule } from './share-schedule.svelte.js';
	import type { ShareScheduleProps } from './types';
	import ShareScheduleImage from './share-schedule-image.svelte';

	let { schedule, currentScheduleIdx, flightType, route }: ShareScheduleProps = $props();

	const {
		state,
		getScheduleName,
		handleSelectTrip,
		handleSelectAllTrip,
		copySimpleFormat,
		copyRegularFormat,
		copyFormattedFormat
	} = useShareSchedule();

	const scheduleName = $derived(getScheduleName(flightType, currentScheduleIdx));

	$effect(() => {
		state.selectedTrips = schedule.trips;
	});
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Share />
	</Sheet.Trigger>
	<Sheet.Content side="right" class="px-0 md:max-w-104">
		<Sheet.Header class="space-y-0 px-4 pb-2">
			<Sheet.Title>Share {scheduleName} Schedule</Sheet.Title>
			<Sheet.Description>
				<p>{route}</p>
				<p>{displayDate(schedule.departureDateTime, 'ddd, DD MMMM YYYY')}</p>
			</Sheet.Description>
			<Separator class="my-4!" />
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<div class="flex items-center gap-2">
					<Checkbox
						bind:checked={() => state.selectedTrips.length === schedule.trips.length, () => {}}
						onclick={() => handleSelectAllTrip(schedule.trips)}
					/>
					<Label class="text-xs">Select All Schedule</Label>
				</div>
				<div>{state.selectedTrips.length} Schedules Selected</div>
			</div>
		</Sheet.Header>
		<div class="custom-scrollbar h-full overflow-y-auto bg-neutral-100 pb-44 pl-4 pr-2 pt-4">
			<div class="rounded-md border-2 border-b bg-white">
				{#each schedule.trips as trip, i}
					{@const checked = !!state.selectedTrips.find((item) => item.key === trip.key)}
					<ShareScheduleItem {trip} onCheck={() => handleSelectTrip(trip)} {checked} />
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 w-full border-t bg-white px-4 py-2">
			<div class="flex items-center gap-4">
				<OSGHtmlToImage
					filename="opsigo-flight-schedule-{displayDate(
						schedule.departureDateTime,
						'ddd, DD MMMM YYYY'
					)}.png"
					variant="outline"
					disabled={state.selectedTrips.length < 1}
					class="flex-1"
				>
					{#snippet html()}
						<ShareScheduleImage {schedule} trips={state.selectedTrips} />
					{/snippet}

					{#snippet actionContent()}
						<Image />
						Download as Image
					{/snippet}
				</OSGHtmlToImage>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger
						class={buttonVariants({ class: 'flex-1' })}
						disabled={state.selectedTrips.length < 1}
					>
						<Clipboard /> Copy <ChevronUp />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start">
						<DropdownMenu.Group>
							<DropdownMenu.Item
								onclick={() => copyRegularFormat(route, schedule.departureDateTime)}
								>Regular Format</DropdownMenu.Item
							>
							<DropdownMenu.Item onclick={() => copySimpleFormat()}>Simple Format</DropdownMenu.Item
							>
							<DropdownMenu.Item
								onclick={() => copyFormattedFormat(route, schedule.departureDateTime)}
								>Formatted Format</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
