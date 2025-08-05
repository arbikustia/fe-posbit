<script lang="ts">
	import { Copy, Download, Mail, Sync, TripleDot } from '$lib/components/icons';
	import Close from '$lib/components/icons/close.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { ChevronUp } from '@lucide/svelte';
	import MOtherActionItem from './m-other-action-item.svelte';

	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger class={buttonVariants({ class: 'bg-gray-300 text-black hover:bg-gray-400' })}>
		<TripleDot />
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="max-h-[70lvh] overflow-y-auto" data-vaul-no-drag>
			<div class="sticky top-0">
				<div class="flex items-center justify-between bg-white p-4 pt-1">
					<div>
						<p>Action</p>
					</div>
					<button onclick={() => (open = false)}>
						<Close />
					</button>
				</div>
				<Separator />
			</div>

			<div class="space-y-4 p-4">
				<div class="rounded-md border px-2 pt-2">
					<p class="text-sm text-gray-500">E-ticket</p>
					<MOtherActionItem label="Download e-ticket" onClick={() => {}}>
						{#snippet icon()}
							<Download class="h-5 w-5" />
						{/snippet}
					</MOtherActionItem>
					<Separator />
					<MOtherActionItem label="Send e-ticket" onClick={() => {}}>
						{#snippet icon()}
							<Mail class="h-5 w-5" />
						{/snippet}
					</MOtherActionItem>
				</div>
				<div class="rounded-md border px-2 pt-2">
					<p class="text-sm text-gray-500">Itinerary</p>
					<MOtherActionItem label="Download itinerary" onClick={() => {}}>
						{#snippet icon()}
							<Download class="h-5 w-5" />
						{/snippet}
					</MOtherActionItem>
					<Separator />
					<MOtherActionItem label="Send itinerary" onClick={() => {}}>
						{#snippet icon()}
							<Mail class="h-5 w-5" />
						{/snippet}
					</MOtherActionItem>
				</div>
				<div class="rounded-md border px-2">
					<MOtherActionItem label="Copy to clipboard" onClick={() => {}}>
						{#snippet icon()}
							<Copy class="h-5 w-5" />
						{/snippet}
					</MOtherActionItem>
				</div>
				<div class="rounded-md border px-2">
					<MOtherActionItem label="Sync PNR" onClick={() => {}}>
						{#snippet icon()}
							<Sync class="h-5 w-5" />
						{/snippet}
					</MOtherActionItem>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
