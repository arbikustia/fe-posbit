<script lang="ts">
	import { Attachment, TextEdit } from '$lib/components/icons';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';

	type RemarkAttachmentCardProps = {
		type: 'remark' | 'attachment';
	};

	const { type }: RemarkAttachmentCardProps = $props();
</script>

<Card.Root class="rounded-none py-0">
	<Card.Content class="p-4 py-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-x-2">
				{#if type === 'remark'}
					<TextEdit class="h-5 w-5" />
				{:else if type === 'attachment'}
					<Attachment class="h-5 w-5" />
				{/if}
				<p class="capitalize">{type}</p>
			</div>
			<Button class="capitalize" variant="outline">Add {type}</Button>
		</div>
	</Card.Content>
</Card.Root>
