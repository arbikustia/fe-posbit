<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import LastSearchItem from './last-search-item.svelte';
	import { useLastSearch } from './last-search.svelte.js';

	const { state, clearLastSearch } = useLastSearch();
</script>

{#if state.lastSearches.length > 0}
	<div class="mb-4 mt-12 flex items-center justify-between">
		<h1 class="text-lg font-semibold text-gray-700">Last Search</h1>
		<Button variant="link" class="h-fit p-0 hover:no-underline" onclick={clearLastSearch}
			>Clear</Button
		>
	</div>

	<!-- Search List -->
	<div class="space-y-4">
		<div class="scrollbar-hide flex gap-x-2 overflow-x-auto scroll-smooth">
			{#each state.lastSearches as lastSearch}
				<LastSearchItem searchFlight={lastSearch} />
			{/each}
		</div>
	</div>
{/if}
