<script lang="ts">
	import { Close, Share } from '$lib/components/icons';
	import { OSGHtmlToImage } from '$lib/components/opsigo-ui/html-to-image';
	import { Button, buttonVariants } from '$lib/components/ui/button/';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Drawer from '$lib/components/ui/drawer/';
	import { Label } from '$lib/components/ui/label/';
	import { Separator } from '$lib/components/ui/separator';
	import { displayDate } from '$lib/helpers/date-helper';
	import { ChevronUp, Clipboard } from '@lucide/svelte';
	import MShareScheduleItem from './m-share-schedule-item-backup.svelte';
	import ShareScheduleImage from './share-schedule-image.svelte';
	import { useShareSchedule } from './share-schedule.svelte.js';
	import type { ShareScheduleProps } from './types';

	let { schedule, currentScheduleIdx, flightType, route }: ShareScheduleProps = $props();

	const {
		state: comState,
		getScheduleName,
		handleSelectTrip,
		handleSelectAllTrip,
		copySimpleFormat,
		copyRegularFormat,
		copyFormattedFormat
	} = useShareSchedule();

	let isOpen = $state(false);
	let isOpenCopyStyle = $state(false);

	const scheduleName = $derived(getScheduleName(flightType, currentScheduleIdx));

	$effect(() => {
		comState.selectedTrips = schedule.trips;
	});
</script>

<Drawer.Root bind:open={isOpen}>
	<Drawer.Trigger
		class={buttonVariants({ variant: 'outline', class: 'h-fit py-2 text-xs shadow-none' })}
	>
		<Share />
	</Drawer.Trigger>
	<Drawer.Content
		class="border-none p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<Drawer.Header class="relative space-y-0 px-0 pb-2 text-start">
			<div class="px-4">
				<Drawer.Title class="mb-2">Share {scheduleName} Schedule</Drawer.Title>
				<Drawer.Description>
					<p>{route}</p>
					<p>{displayDate(schedule.departureDateTime, 'ddd, DD MMMM YYYY')}</p>
				</Drawer.Description>
			</div>
			<Separator class="my-1!" />
			<div class="text-muted-foreground flex items-center justify-between px-4 text-xs">
				<div>{comState.selectedTrips.length} Schedules Selected</div>
				<div class="flex items-center gap-2">
					<Label class="text-xs">Select All Schedule</Label>
					<Checkbox
						bind:checked={() => comState.selectedTrips.length === schedule.trips.length, () => {}}
						onclick={() => handleSelectAllTrip(schedule.trips)}
					/>
				</div>
			</div>
			<Drawer.Close class="text-muted-foreground absolute right-2 top-2">
				<Close />
			</Drawer.Close>
		</Drawer.Header>
		<div class="custom-scrollbar h-full overflow-y-auto bg-neutral-100 px-2 pb-32 pl-4 pt-4">
			<div class="rounded-md border-2 border-b bg-white">
				{#each schedule.trips as trip, i}
					{@const checked = !!comState.selectedTrips.find((item) => item.key === trip.key)}
					<MShareScheduleItem {trip} onCheck={() => handleSelectTrip(trip)} {checked} />
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 w-full border-t bg-white px-4 py-2">
			<div class="flex flex-wrap items-center gap-2">
				<OSGHtmlToImage
					filename="opsigo-flight-schedule-{displayDate(
						schedule.departureDateTime,
						'ddd, DD MMMM YYYY'
					)}.png"
					variant="outline"
					disabled={comState.selectedTrips.length < 1}
					class="flex-1"
				>
					<ShareScheduleImage {schedule} trips={comState.selectedTrips} />
				</OSGHtmlToImage>

				<Button class="flex-1" onclick={() => (isOpenCopyStyle = true)}>
					<Clipboard /> Copy <ChevronUp />
				</Button>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>

<Drawer.Root bind:open={isOpenCopyStyle}>
	<Drawer.Content>
		<Button
			variant="ghost"
			onclick={() => {
				copyRegularFormat(route, schedule.departureDateTime);
				isOpenCopyStyle = false;
			}}>Regular Format</Button
		>
		<Button
			variant="ghost"
			onclick={() => {
				copySimpleFormat();
				isOpenCopyStyle = false;
			}}>Simple Format</Button
		>
		<Button
			variant="ghost"
			onclick={() => {
				copyFormattedFormat(route, schedule.departureDateTime);
				isOpenCopyStyle = false;
			}}>Formatted Format</Button
		>
	</Drawer.Content>
</Drawer.Root>
