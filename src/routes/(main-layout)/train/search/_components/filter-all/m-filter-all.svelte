<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger class={cn('text-xs')}>
		<Icon icon="mage:filter" class="h-7 w-7" />
		<span>Filter</span>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Filter</Drawer.Title>
		</Drawer.Header>
	</Drawer.Content>
</Drawer.Root>
