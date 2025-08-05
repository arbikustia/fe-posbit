<script lang="ts">
	import { Share } from '$lib/components/icons';
	import { OSGHtmlToImage } from '$lib/components/opsigo-ui/html-to-image';
	import { buttonVariants } from '$lib/components/ui/button/';
	import * as Drawer from '$lib/components/ui/drawer/';
	import { Separator } from '$lib/components/ui/separator';
	import { Bold, ChevronRight, ClipboardList, Image } from '@lucide/svelte';
	import MShareScheduleItem from './m-share-schedule-item.svelte';
	import ShareScheduleImage from './share-schedule-image.svelte';
	import { useShareSchedule } from './share-schedule.svelte.js';

	const { copySimpleFormat, copyRegularFormat, copyFormattedFormat } = useShareSchedule();
</script>

<Drawer.Root>
	<Drawer.Trigger
		class={buttonVariants({
			variant: 'outline',
			size: 'sm',
			class: 'h-fit border-primary px-1 py-1'
		})}
	>
		<Share />
	</Drawer.Trigger>

	<Drawer.Content>
		<Drawer.Header class="relative space-y-0 px-0 pb-2 text-start">
			<div class="px-4">
				<Drawer.Title class="mb-2 flex items-center gap-2"><Share /> Share</Drawer.Title>
			</div>
		</Drawer.Header>
		<div class="p-4">
			<div class="rounded-md border pt-2">
				<p class="px-2 text-sm text-gray-500">Text</p>
				<MShareScheduleItem label="Regular Format" onclick={() => copyRegularFormat(true)}>
					{#snippet icon()}
						<ClipboardList class="h-5! w-5!" />
					{/snippet}
				</MShareScheduleItem>
				<Separator />
				<MShareScheduleItem label="Simple Format" onclick={() => copySimpleFormat(true)}>
					{#snippet icon()}
						<ClipboardList class="h-5! w-5!" />
					{/snippet}
				</MShareScheduleItem>
				<Separator />
				<MShareScheduleItem label="Formatted Format" onclick={() => copyFormattedFormat(true)}>
					{#snippet icon()}
						<Bold class="h-5! w-5!" />
					{/snippet}
				</MShareScheduleItem>
			</div>

			<OSGHtmlToImage
				filename="opsigo-train-schedule.png"
				variant="ghost"
				class="mt-4 flex h-fit w-full items-center justify-between rounded-md border p-2 text-base font-normal text-black hover:no-underline"
				useShareApi
			>
				{#snippet html()}
					<ShareScheduleImage />
				{/snippet}

				{#snippet actionContent()}
					<div class="flex items-center gap-2">
						<Image class="h-5! w-5!" />
						As Image
					</div>
					<ChevronRight class="h-6! w-6! text-primary" />
				{/snippet}
			</OSGHtmlToImage>
		</div>
	</Drawer.Content>
</Drawer.Root>
