<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { TableArticleRow } from '$lib/types/Article';
	import Icon from '@iconify/svelte';
	import { ConfirmDialog } from '../confirm-dialog';

	let { rows }: { rows: TableArticleRow[] } = $props();
	let isConfirm = $state(false);
	let selectedData = $state<TableArticleRow | null>(null);
</script>

<div class="mt-4 w-full bg-white">
	<div class="overflow-hidden rounded-lg border border-gray-200">
		<table class="w-full">
			<thead class="bg-gray-100">
				<tr class="text-left text-sm font-medium text-gray-700">
					<th class="px-4 py-3">Created Time</th>
					<th class="px-4 py-3">Title</th>
					<th class="px-4 py-3 text-center">Tags</th>
					<th class="px-4 py-3 text-center">Status</th>
					<th class="px-4 py-3 text-center">Action</th>
				</tr>
			</thead>
			<tbody>
				{#each rows as row}
					<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
						<td class="px-4 py-3">{row.createdTime}</td>
						<td class="px-4 py-3">{row.title}</td>
						<td class="flex flex-wrap justify-center gap-2 px-4 py-3">
							{#each row.tags as tag}
								<div class="badge-article tag">
									{tag}
								</div>
							{/each}
						</td>
						<td class="px-4 py-3">
							<div class={['badge-article mx-auto', row.status]}>
								{row.status}
							</div>
						</td>
						<td class="flex justify-center gap-1 px-4 py-3">
							<Button variant="outline">
								<Icon icon="mdi:eye-outline" />
							</Button>
							<Button variant="outline">
								<Icon icon="lucide:edit" />
							</Button>
							<Button
								variant="outline"
								onclick={() => {
									isConfirm = true;
									selectedData = row;
								}}
							>
								<Icon icon="tabler:trash" />
							</Button>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

{#if selectedData}
	<ConfirmDialog bind:isConfirm title={selectedData?.title} />
{/if}

<style>
	@reference '$appCss';
	.badge-article {
		@apply w-max rounded-lg px-3 py-1 text-sm capitalize;
	}
	.badge-article.tag {
		@apply bg-[#F1F5F9];
	}
	.badge-article.published {
		@apply bg-[#081EA9] text-white;
	}
	.badge-article.archived {
		@apply bg-[#44403C] text-white;
	}
	.badge-article.draft {
		@apply bg-[#E0E0E0];
	}
</style>
