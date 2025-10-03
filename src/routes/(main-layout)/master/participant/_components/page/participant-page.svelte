<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';

	type TableRow = {
		id?: number;
		type: string;
		productName: string;
		bookCode: string;
		routeCity: string;
		requestedBy: string;
		company: string;
		expiredIn: string;
		open: boolean;
	};

	const rows: TableRow[] = [
		{
			id: 1,
			type: 'hotel',
			productName: 'Four Points by Sheraton...',
			bookCode: 'ABC123',
			routeCity: 'Jakarta',
			requestedBy: 'Admin XX',
			company: 'RSP (Reka Sinerka Pratama)',
			expiredIn: '15 minutes',
			open: true
		},
		{
			id: 2,
			type: 'flight',
			productName: 'Garuda Indonesia',
			bookCode: 'ABC123',
			routeCity: 'SIN→JKT',
			requestedBy: 'Admin XX',
			company: 'RSP (Reka Sinerka Pratama)',
			expiredIn: '15 minutes',
			open: true
		},
		{
			id: 3,
			type: 'hotel',
			productName: 'Four Points by Sheraton...',
			bookCode: 'ABC123',
			routeCity: 'Jakarta',
			requestedBy: 'Admin XX',
			company: 'RSP (Reka Sinerka Pratama)',
			expiredIn: '15 minutes',
			open: true
		},
		{
			id: 4,
			type: 'flight',
			productName: 'Garuda Indonesia',
			bookCode: 'ABC123',
			routeCity: 'SIN→JKT',
			requestedBy: 'Admin XX',
			company: 'RSP (Reka Sinerka Pratama)',
			expiredIn: '15 minutes',
			open: true
		}
	];
</script>

<div class="flex items-end justify-between">
	<div class="flex flex-col">
		<div class="text-xl font-medium">Master Participant</div>
		<div class="text-gray-400">Manage data participant</div>
	</div>

	<div class="flex space-x-3">
		<Input placeholder="search data.." />
		<Button onclick={() => goto('/master/participant/create')}>Create +</Button>
	</div>
</div>
<div class="overflow-hidden rounded-lg border border-gray-200">
	<table class="w-full">
		<thead class="bg-gray-100">
			<tr class="text-left text-sm font-medium text-gray-700">
				<th class="px-4 py-3">No</th>
				<th class="px-4 py-3">Participant Name</th>
				<th class="px-4 py-3">Role</th>
				<th class="px-4 py-3">Action</th>
			</tr>
		</thead>
		<tbody>
			{#each rows as row, index}
				<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
					<td class="px-4 py-3 text-gray-500">{index + 1}</td>
					<td class="px-4 py-3">{row.bookCode}</td>
					<td class="px-4 py-3">{row.bookCode}</td>
					<td class="px-4 py-3">
						{#if row.open}
							<div class="flex items-center gap-2">
								<Icon
									icon="material-symbols-light:delete-rounded"
									width="28"
									height="28"
									style="color: #ff0f22"
								/>
								<Icon icon="lucide:edit" width="20" height="20" style="color: #cea200" />
							</div>
						{/if}
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<Pagination.Root count={100} perPage={10}>
	{#snippet children({ pages, currentPage })}
		<div class="flex w-full justify-end">
			<Pagination.Content>
				<Pagination.Item>
					<Pagination.PrevButton />
				</Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item>
							<Pagination.Ellipsis />
						</Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item>
					<Pagination.NextButton />
				</Pagination.Item>
			</Pagination.Content>
		</div>
	{/snippet}
</Pagination.Root>
