<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { HTMLAttributes } from 'svelte/elements';
	import LastSearchItem from './last-search-item.svelte';
	import { useLastSearch } from './last-search.svelte.js';
	import { cn } from '$lib/utils';

	type LastSearchProps = {
		class?: HTMLAttributes<HTMLDivElement>['class'];
		titleClass?: HTMLAttributes<HTMLHeadingElement>['class'];
		clearBtnClass?: HTMLAttributes<HTMLButtonElement>['class'];
	};

	let { class: className, titleClass, clearBtnClass }: LastSearchProps = $props();

	const { state, clearLastSearch } = useLastSearch();
</script>

{#if state.lastSearches.length > 0}
	<div class="mb-4 flex items-center justify-between">
		<h1 class={cn('text-lg font-semibold text-gray-700', titleClass)}>Last Search</h1>
		<Button
			variant="link"
			class={cn('h-fit p-0 hover:no-underline', clearBtnClass)}
			onclick={clearLastSearch}>Clear</Button
		>
	</div>

	<!-- Search List -->
	<div class="space-y-4">
		<div class={cn('grid grid-cols-4 gap-4', className)}>
			{#each state.lastSearches as lastSearch}
				<LastSearchItem searchTrain={lastSearch} />
			{/each}
		</div>
	</div>
{/if}
