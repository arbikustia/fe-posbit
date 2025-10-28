<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import LayoutList from '@lucide/svelte/icons/layout-list';
	import Table from '@lucide/svelte/icons/table';

	export type ListViewMode = 'list' | 'table';

	let { value = $bindable() }: { value: ListViewMode } = $props();

	const modes = [
		{
			value: 'list',
			icon: LayoutList
		},
		{
			value: 'table',
			icon: Table
		}
	];
</script>

<Tabs.Root bind:value>
	<Tabs.List class="h-fit rounded-full bg-gray-200">
		{#each modes as mode (mode.value)}
			{@const Icon = mode.icon}
			<Tabs.Trigger value={mode.value} class="h-7 w-7 rounded-full p-0">
				<Icon class="h-4 w-4" />
			</Tabs.Trigger>
		{/each}
	</Tabs.List>
</Tabs.Root>
