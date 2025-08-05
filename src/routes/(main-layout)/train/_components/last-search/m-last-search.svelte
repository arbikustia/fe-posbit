<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import LastSearchItem from './last-search-item.svelte';
</script>

<div class="mb-4 flex items-center justify-between px-4">
	<h1 class="text-lg font-semibold text-gray-700">Last Search</h1>
	<Button variant="link" class="h-fit p-0 hover:no-underline">Clear</Button>
</div>

<!-- Search List -->
<div class="space-y-4 pl-4">
	<div class="scrollbar-hide flex gap-x-2 overflow-x-auto scroll-smooth">
		{#each Array(5)}
			<!-- <LastSearchItem /> -->
		{/each}
	</div>
</div>
