<script lang="ts">
	import { Attachment, FileImage, FilePdf, Trash } from '$lib/components/icons';
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { formatFileSize } from '$lib/helpers/file-helper';

	type AttachmentType = 'image' | 'pdf';

	const attachments: {
		id: number;
		name: string;
		type: AttachmentType;
		format: string;
		size: number;
	}[] = [
		{
			id: 1,
			name: 'Bukti pembayaran',
			type: 'image',
			format: 'image/jpg',
			size: 323400
		},
		{
			id: 2,
			name: 'Bukti pembayaran',
			type: 'pdf',
			format: 'pdf',
			size: 323400
		}
	];

	const icon = {
		image: FileImage,
		pdf: FilePdf
	};

	let { status }: { status: BookingStatus } = $props();
</script>

<Card.Root class="gap-0 border-2 py-0" style="border-color: {bookingStatusColor[status]};">
	<Card.Header class="pb-0! border-b p-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2 font-semibold">
				<Attachment class="h-6 w-6" />
				Attachments ({attachments.length})
			</div>
			<Button variant="outline">Add</Button>
		</div>
	</Card.Header>
	<Card.Content class="p-4">
		{#if attachments.length > 0}
			<div>
				{#each attachments as attachment, attachmentIdx}
					{@const isLast = attachmentIdx === attachments.length - 1}
					{@const Icon = icon[attachment.type]}
					<div class="flex items-center justify-between">
						<div class="flex items-center gap-x-2">
							<Icon class="h-8 w-8 text-gray-500" />
							<div>
								<div class="text-sm">{attachment.name}</div>
								<div class="text-[0.6rem]">{attachment.format}</div>
							</div>
						</div>
						<div>
							<div class="flex items-center gap-x-2">
								{formatFileSize(attachment.size)}
								<button><Trash class="h-5 w-5" /></button>
							</div>
						</div>
					</div>
					{#if !isLast}
						<OSGDashSeparator class="my-4 border-b border-gray-300" />
					{/if}
				{/each}
			</div>
		{:else}
			<div class="text-center">
				<p class="text-gray-500">No attachment added</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
