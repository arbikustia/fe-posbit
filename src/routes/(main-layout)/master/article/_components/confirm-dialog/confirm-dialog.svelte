<script>
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Icon from '@iconify/svelte';
	let { isConfirm = $bindable(false), title } = $props();
</script>

<Dialog.Root bind:open={isConfirm}>
	<Dialog.Content class="w-[480px] gap-2 rounded-lg border-2">
		<Dialog.Header class="flex-row">
			<div class="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
				<Icon icon="solar:danger-triangle-linear" class="text-xl text-red-500" />
			</div>
			<Dialog.Title class="text-xl text-gray-800">Delete Confirmation</Dialog.Title>
		</Dialog.Header>
		<p class="text-gray-500">Are you sure want to delete <strong>{title}</strong>?</p>
		<Dialog.Footer class="mt-3">
			<Button size="lg" onclick={() => (isConfirm = false)} class="text-gray-500" variant="link">
				Cancel
			</Button>
			<Button size="lg" onclick={() => (isConfirm = false)} variant="danger">Delete</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
