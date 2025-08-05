<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { DndEvent } from 'svelte-dnd-action';
	import Icon from '@iconify/svelte';
	import type { CustomizeColumnItem } from './type';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';

	let {
		searchQuery,
		columnAvailable = $bindable()
	}: {
		searchQuery: string;
		columnAvailable: CustomizeColumnItem[];
	} = $props();

	const flipDurationMs = 300;
	let dragging = $state(false);
	const dragDisabled = $derived(!dragging);

	const filteredColumn = $derived(
		columnAvailable
			.slice()
			.sort((a, b) => Number(b.isActive) - Number(a.isActive))
			.filter((col) => col.header.toLowerCase().includes(searchQuery.toLowerCase()))
			.map((e, index) => ({
				...e,
				index: index + 1
			}))
	);

	const startDrag = () => (dragging = true);
	const stopDrag = () => (dragging = false);
	const handleDnd = (event: DndEvent<CustomizeColumnItem>, type: string) => {
		columnAvailable = event.items.map((e, index) => ({
			...e,
			index: index + 1
		}));
		if (type === 'finalize') dragging = false;
	};

	const onBlurIndex = (
		e: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		},
		field: string
	) => {
		let inputIndex = Number(e.currentTarget.value);
		if (inputIndex < 1) inputIndex = 1;
		if (inputIndex > columnAvailable.length) inputIndex = columnAvailable.length;
		e.currentTarget.value = inputIndex.toString();
		const fromIdx = columnAvailable.findIndex((c) => c.field === field);
		const toIdx = inputIndex - 1;
		if (fromIdx === -1 || fromIdx === toIdx) return;
		const item = columnAvailable.splice(fromIdx, 1)[0];
		columnAvailable.splice(toIdx, 0, item);
		columnAvailable = columnAvailable.map((col, idx) => ({
			...col,
			index: idx + 1
		}));
	};

	const onCheckedColumn = (val: boolean, field: string) => {
		const index = columnAvailable.findIndex((e) => e.field === field);
		columnAvailable[index].isActive = val;
	};
</script>

<div class="flex-auto">
	<div class="config-info">
		<h1>Available Column</h1>
		<div class="badge">{filteredColumn.length} Columns</div>
	</div>
	<table class="column-table">
		<thead>
			<tr>
				<th class="w-12">Move</th>
				<th class="w-12">Show</th>
				<th>Columns Name</th>
				<th class="w-24">Position</th>
			</tr>
		</thead>
		<tbody
			use:dndzone={{ items: filteredColumn, flipDurationMs, dragDisabled }}
			onconsider={(e) => handleDnd(e.detail, 'consider')}
			onfinalize={(e) => handleDnd(e.detail, 'finalize')}
		>
			{#each filteredColumn as column, index (column.id)}
				<tr animate:flip={{ duration: flipDurationMs }} data-item={column}>
					<td>
						<button
							type="button"
							onpointerdown={startDrag}
							onpointerup={stopDrag}
							onpointercancel={stopDrag}
							onmouseleave={stopDrag}
						>
							<Icon icon="lsicon:drag-filled" class="cursor-move text-xl" />
						</button>
					</td>
					<td>
						<Checkbox
							id={column.field}
							bind:checked={column.isActive}
							onCheckedChange={(e) => onCheckedColumn(e, column.field)}
						/>
					</td>
					<td>
						<label for={column.field} class="cursor-pointer">{column.header}</label>
					</td>
					<td>
						<Input
							value={column.index}
							onblur={($e) => onBlurIndex($e, column.field)}
							class="w-16"
							type="number"
						/>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	@reference '$appCss';
	.column-table {
		@apply mt-2 w-full rounded-lg border;
	}
	.column-table > thead > tr {
		@apply border-b;
	}
	.column-table > thead > tr > th {
		@apply px-3 py-2 text-left text-sm font-medium text-gray-500;
	}
	.column-table > tbody > tr > td {
		@apply px-3 py-2 text-left text-sm;
	}
</style>
