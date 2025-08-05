<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { redirectToSearchHotel, saveLastSearchHotel } from '$lib/helpers/search-hotel-helper';
	import dayjs from 'dayjs';
	import type { HTMLAttributes } from 'svelte/elements';
	import { useLastSearch } from './last-search.svelte';
	import { cn } from '$lib/utils';

	type PreviousStayProps = {
		titleClass?: HTMLAttributes<HTMLHeadingElement>['class'];
		clearBtnClass?: HTMLAttributes<HTMLButtonElement>['class'];
		type: string;
	};

	let { clearLastSearch, state } = useLastSearch();
	const { type, titleClass, clearBtnClass }: PreviousStayProps = $props();
	function onClickItem(search: any) {
		console.log(search);
		redirectToSearchHotel(search);
		saveLastSearchHotel(search);
	}

	$effect(() => {
		$inspect(state.lastSearches, 'last searches updated');
	});
</script>

{#if state.lastSearches.length > 0 && type == 'combination'}
	<div class="space-y-6">
		<div>
			<div class="mb-2 flex w-full items-center justify-between">
				<h2 class={cn('text-lg font-semibold text-gray-800', titleClass)}>Last Search</h2>
				<Button
					variant="link"
					onclick={clearLastSearch}
					class={cn('text-md font-medium', clearBtnClass)}>Clear</Button
				>
			</div>
			<div class="flex gap-4 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]">
				{#each state.lastSearches as search}
					<Button
						variant="outline"
						onclick={() => onClickItem(search)}
						class="shadow-xs flex min-h-20 w-[42%]  items-center justify-between gap-5 rounded-md border p-5 transition hover:shadow-sm"
					>
						<img class="w-[10%]" src="/images/hotel-icon.png" alt="hotel-icon" />
						<div class="w-[60%] text-start">
							<h3 class="w-[100%] overflow-hidden truncate text-sm font-semibold">
								{search.destination}
							</h3>
							<p class="truncate text-sm text-gray-600">
								{dayjs(search.date?.start).format('D MMMM YYYY')}-{dayjs(search.date?.end).format(
									'D MMMM YYYY'
								)}
							</p>
							<p class="text-xs text-gray-600">{search.room} Rooms • {search.guest} Guest</p>
						</div>
						<div class="w-[10%] text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</Button>
				{/each}
			</div>
		</div>
	</div>
{:else if state.lastSearches.length > 0}
	<div class="space-y-6 py-4">
		<div>
			<div class="mb-2 flex items-center justify-between">
				<h2 class="text-lg font-semibold text-gray-800">Last Search</h2>
				<Button variant="link" onclick={clearLastSearch} class="text-md font-medium">Clear</Button>
			</div>
			<div class="flex flex-wrap gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each state.lastSearches as search}
					<Button
						variant="outline"
						onclick={() => onClickItem(search)}
						class="shadow-xs flex min-h-20 w-[32%]  items-center justify-between gap-5 rounded-md border p-5 transition hover:shadow-sm"
					>
						<img class="w-[10%]" src="/images/hotel-icon.png" alt="hotel-icon" />
						<div class="w-[60%] text-start">
							<h3 class="w-[100%] overflow-hidden truncate text-sm font-semibold">
								{search.destination}
							</h3>
							<p class="truncate text-sm text-gray-600">
								{dayjs(search.date?.start).format('D MMMM YYYY')}-{dayjs(search.date?.end).format(
									'D MMMM YYYY'
								)}
							</p>
							<p class="text-xs text-gray-600">{search.room} Rooms • {search.guest} Guest</p>
						</div>
						<div class="w-[10%] text-gray-400">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</div>
					</Button>
				{/each}
			</div>
		</div>
	</div>
{/if}
