import type { ColumnDef } from '@tanstack/table-core';
import bookers from '$lib/dummy/bookers.json';
import { renderSnippet } from '$lib/components/ui/data-table';
import { createRawSnippet } from 'svelte';

export type Schema = {
	no: number;
	userId: string;
	name: string;
	dailyAvgTicket: number;
	dailyAvgGMV: string;
	monthlyAvgTicket: number;
	monthlyAvgGMV: string;
};

export function useBookersTable() {
	const views = [
		{ id: 'internal', label: 'Internal Booker', badge: 10 },
		{ id: 'external', label: 'External Booker', badge: 3 }
	];
	let data = $state<Schema[]>(bookers);
	const columns: ColumnDef<Schema>[] = [
		{
			accessorKey: 'no',
			header: 'No',
			// cell: ({ row }) => renderSnippet(DataTableType, { row })
			cell: ({ row }) => row.getValue('no')
		},
		{
			accessorKey: 'userId',
			header: 'User Id',
			cell: ({ row }) => row.getValue('userId')
		},
		{
			accessorKey: 'name',
			header: 'Name',
			cell: ({ row }) => row.getValue('name')
		},
		{
			accessorKey: 'dailyAvgTicket',
			header: () =>
				renderSnippet(
					createRawSnippet(() => ({
						render: () => '<div class="w-full text-center">Daily Avg. (Ticket)</div>'
					}))
				),
			cell: ({ row }) =>
				renderSnippet(
					createRawSnippet(() => ({
						render: () => `<div class="w-full text-center">${row.getValue('dailyAvgTicket')}</div>`
					}))
				)
		},
		{
			accessorKey: 'dailyAvgGMV',
			header: 'Daily Avg. (GMV)',
			cell: ({ row }) => row.getValue('dailyAvgGMV')
		},
		{
			accessorKey: 'monthlyAvgTicket',
			header: () =>
				renderSnippet(
					createRawSnippet(() => ({
						render: () => '<div class="w-full text-center">Monthly Avg. (Ticket)</div>'
					}))
				),
			cell: ({ row }) =>
				renderSnippet(
					createRawSnippet(() => ({
						render: () =>
							`<div class="w-full text-center">${row.getValue('monthlyAvgTicket')}</div>`
					}))
				)
		},
		{
			accessorKey: 'monthlyAvgGMV',
			header: 'Monthly Avg. (GMV)',
			cell: ({ row }) => row.getValue('monthlyAvgGMV')
		}
	];
	return {
		views,
		data,
		columns
	};
}
