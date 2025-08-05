<script lang="ts">
	import { Share } from '$lib/components/icons';
	import { OSGHtmlToImage } from '$lib/components/opsigo-ui/html-to-image';
	import { buttonVariants } from '$lib/components/ui/button/';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Label } from '$lib/components/ui/label/';
	import { Separator } from '$lib/components/ui/separator';
	import * as Sheet from '$lib/components/ui/sheet/';
	import { ChevronUp, Clipboard, Image } from '@lucide/svelte';
	import ShareScheduleItem from './share-schedule-item.svelte';
	import { useShareSchedule } from './share-schedule.svelte.js';
	import ShareScheduleImage from './share-schedule-image.svelte';

	const { copySimpleFormat, copyRegularFormat, copyFormattedFormat } = useShareSchedule();
</script>

<Sheet.Root>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline' })}>
		<Share />
	</Sheet.Trigger>
	<Sheet.Content side="right" class="px-0 md:max-w-lg">
		<Sheet.Header class="space-y-0 px-4 pb-2">
			<Sheet.Title>Share Departure Schedule</Sheet.Title>
			<Sheet.Description>
				<p>Gambir (GMR) → Bandung (BD)</p>
				<p>Mon, 6 June 2025</p>
			</Sheet.Description>
			<Separator class="my-4!" />
			<div class="flex items-center justify-between text-xs text-muted-foreground">
				<div class="flex items-center gap-2">
					<Checkbox />
					<Label class="text-xs">Select All Schedule</Label>
				</div>
				<div>10 Schedules Selected</div>
			</div>
		</Sheet.Header>
		<div class="custom-scrollbar h-full overflow-y-auto bg-neutral-100 pb-44 pl-4 pr-2 pt-4">
			<div class="rounded-md border-2 border-b bg-white">
				{#each Array(10) as trip, i}
					<ShareScheduleItem />
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 w-full border-t bg-white px-4 py-2">
			<div class="flex items-center gap-4">
				<OSGHtmlToImage filename="opsigo-train-schedule.png" variant="outline" class="flex-1">
					{#snippet html()}
						<ShareScheduleImage />
					{/snippet}

					{#snippet actionContent()}
						<Image />
						Download as Image
					{/snippet}
				</OSGHtmlToImage>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger class={buttonVariants({ class: 'flex-1' })}>
						<Clipboard /> Copy <ChevronUp />
					</DropdownMenu.Trigger>
					<DropdownMenu.Content align="start">
						<DropdownMenu.Group>
							<DropdownMenu.Item onclick={() => copyRegularFormat()}
								>Regular Format</DropdownMenu.Item
							>
							<DropdownMenu.Item onclick={() => copySimpleFormat()}>Simple Format</DropdownMenu.Item
							>
							<DropdownMenu.Item onclick={() => copyFormattedFormat()}
								>Formatted Format</DropdownMenu.Item
							>
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
		</div>
	</Sheet.Content>
</Sheet.Root>
