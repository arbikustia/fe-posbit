<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { cn } from '$lib/utils';

	const categories = ['all', 'flight', 'hotel', 'train', 'insurance'];

	let value = $state('all');
</script>

<div>
	<p class="mb-1 text-sm font-semibold">Product</p>
	<Tabs.Root bind:value class="w-fit">
		<Tabs.List class="border">
			{#each categories as category}
				<Tabs.Trigger value={category} class={cn('data-[state=active]:text-primary capitalize')}
					>{category}</Tabs.Trigger
				>
			{/each}
		</Tabs.List>
	</Tabs.Root>
</div>
