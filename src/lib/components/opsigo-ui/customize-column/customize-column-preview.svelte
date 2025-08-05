<script lang="ts">
	import type { CustomizeColumnItem } from './type';
	let {
		columnAvailable
	}: {
		columnAvailable: CustomizeColumnItem[];
	} = $props();
	const columnVisible = $derived(columnAvailable.filter((e) => e.isActive));
</script>

<div class="w-[285px]">
	<div class="config-info">
		<h1>Column Preview</h1>
		<div class="badge">{columnVisible.length} Visible</div>
	</div>
	<div class="preview-column">
		<h6>Columns will appear in this order:</h6>
		{#each columnVisible as column, index}
			<div class="preview-item">
				<div class="numeric">{index + 1}</div>
				<p>{column.header}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	@reference '$appCss';
	.preview-column {
		@apply mt-2 space-y-3 rounded-md border p-3;
	}
	.preview-column > h6 {
		@apply mb-3 text-sm text-gray-500;
	}
	.preview-column > .preview-item {
		@apply flex items-center gap-2 border-b pb-3;
	}
	.preview-column > .preview-item > .numeric {
		@apply flex h-7 w-7 items-center justify-center rounded-full bg-black text-sm text-white;
	}
	.preview-column > .preview-item > p {
		@apply text-sm font-semibold;
	}
</style>
