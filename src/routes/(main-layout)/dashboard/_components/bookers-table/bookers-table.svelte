<script lang="ts">
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel,
		type ColumnFiltersState,
		type PaginationState,
		type Row,
		type RowSelectionState,
		type SortingState,
		type VisibilityState
	} from '@tanstack/table-core';
	import type { Schema } from './bookers-table.svelte.js';
	import { createSvelteTable } from '$lib/components/ui/data-table/data-table.svelte.js';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	// import * as Select from '$lib/components/ui/select/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Card from '$lib/components/ui/card/index.js';

	import { useBookersTable } from './bookers-table.svelte.js';
	import Icon from '@iconify/svelte';
	import { OSGPresetDatePicker } from '$lib/components/opsigo-ui/preset-date-picker/index.js';
	import type { DateRange } from 'bits-ui';

	const { data, columns, views } = useBookersTable();
	let activeTab = $state('internal');
	let dateFilterValue = $state<DateRange>({
		start: undefined,
		end: undefined
	});

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			}
		},
		getRowId: (row) => row.userId.toString(),
		enableRowSelection: true,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		}
	});
</script>

<Card.Root class="@container/card px-6">
	<Card.Header class="px-2">
		<Card.Title class="text-xl font-bold">Booker Performance</Card.Title>
	</Card.Header>
	<Card.Content class="px-0 pt-0">
		<Tabs.Root bind:value={activeTab} class="w-full flex-col justify-start gap-6">
			<div class="flex items-center justify-between px-2">
				<Tabs.List
					class="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex"
				>
					{#each views as view (view.id)}
						<Tabs.Trigger value={view.id}>
							{view.label}
							{#if view.badge > 0}
								<Badge variant="secondary">{view.badge}</Badge>
							{/if}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
				<div class="flex items-center gap-2">
					<OSGPresetDatePicker bind:value={dateFilterValue} />
				</div>
			</div>

			<div class="relative flex flex-col gap-4 overflow-auto px-2">
				<div class="overflow-hidden rounded-lg border">
					<Table.Root>
						<Table.Header class="bg-muted sticky top-0 z-10">
							{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
								<Table.Row>
									{#each headerGroup.headers as header (header.id)}
										<Table.Head colspan={header.colSpan}>
											{#if !header.isPlaceholder}
												<FlexRender
													content={header.column.columnDef.header}
													context={header.getContext()}
												/>
											{/if}
										</Table.Head>
									{/each}
								</Table.Row>
							{/each}
						</Table.Header>
						<Table.Body class="**:data-[slot=table-cell]:first:w-8">
							{#if table.getRowModel().rows?.length}
								{#each table.getRowModel().rows as row (row.id)}
									{@render TableRow({ row })}
								{/each}
							{:else}
								<Table.Row>
									<Table.Cell colspan={columns.length} class="h-24 text-center">
										No results.
									</Table.Cell>
								</Table.Row>
							{/if}
						</Table.Body>
					</Table.Root>
				</div>
				{@render paginationContent()}

				<div class="mt-3 text-sm font-semibold text-gray-500">
					<p>*Daily Avg = The average number of tickets issued in the selected month.</p>
					<p>*Monthly Avg = The average number of monthly tickets issued in the current year.</p>
					<p>*GMV = Gross Merchandise Value</p>
				</div>
			</div>
		</Tabs.Root>
	</Card.Content>
</Card.Root>

{#snippet TableRow({ row }: { row: Row<Schema> })}
	<Table.Row
		data-state={row.getIsSelected() && 'selected'}
		class="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80"
	>
		{#each row.getVisibleCells() as cell (cell.id)}
			<Table.Cell>
				<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
			</Table.Cell>
		{/each}
	</Table.Row>
{/snippet}

{#snippet paginationContent()}
	<div class="flex items-center justify-between px-4">
		<div class="text-muted-foreground hidden flex-1 text-sm lg:flex">
			{table.getFilteredSelectedRowModel().rows.length} of
			{table.getFilteredRowModel().rows.length} row(s) selected.
		</div>
		<div class="flex w-full items-center gap-8 lg:w-fit">
			<div class="hidden items-center gap-2 lg:flex">
				<Label for="rows-per-page" class="text-sm font-medium">Rows per page</Label>
				<!-- <Select.Root
					type="single"
					bind:value={
						() => `${table.getState().pagination.pageSize}`, (v) => table.setPageSize(Number(v))
					}
				>
					<Select.Trigger size="sm" class="w-20" id="rows-per-page">
						{table.getState().pagination.pageSize}
					</Select.Trigger>
					<Select.Content side="top">
						{#each [10, 20, 30, 40, 50] as pageSize (pageSize)}
							<Select.Item value={pageSize.toString()}>
								{pageSize}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root> -->
			</div>
			<div class="flex w-fit items-center justify-center text-sm font-medium">
				Page {table.getState().pagination.pageIndex + 1} of
				{table.getPageCount()}
			</div>
			<div class="ml-auto flex items-center gap-2 lg:ml-0">
				<Button
					variant="outline"
					class="hidden h-8 w-8 p-0 lg:flex"
					onclick={() => table.setPageIndex(0)}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to first page</span>
					<Icon icon="tabler:chevrons-left" />
				</Button>
				<Button
					variant="outline"
					class="size-8"
					size="icon"
					onclick={() => table.previousPage()}
					disabled={!table.getCanPreviousPage()}
				>
					<span class="sr-only">Go to previous page</span>
					<Icon icon="material-symbols:chevron-left" />
				</Button>
				<Button
					variant="outline"
					class="size-8"
					size="icon"
					onclick={() => table.nextPage()}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to next page</span>
					<Icon icon="material-symbols:chevron-right" />
				</Button>
				<Button
					variant="outline"
					class="hidden size-8 lg:flex"
					size="icon"
					onclick={() => table.setPageIndex(table.getPageCount() - 1)}
					disabled={!table.getCanNextPage()}
				>
					<span class="sr-only">Go to last page</span>
					<Icon icon="tabler:chevrons-right" />
				</Button>
			</div>
		</div>
	</div>
{/snippet}
