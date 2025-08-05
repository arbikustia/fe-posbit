<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils';
	import { ChevronDown } from '@lucide/svelte';

	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger
		class={cn(
			'flex items-center gap-2 rounded-md border border-input px-3 py-1 text-sm font-medium '
		)}
	>
		<span>Price</span>
		<ChevronDown class="h-4 w-4" />
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Price</Drawer.Title>
		</Drawer.Header>
	</Drawer.Content>
</Drawer.Root>
