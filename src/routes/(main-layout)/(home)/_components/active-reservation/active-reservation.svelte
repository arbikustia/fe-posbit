<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';

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

	const tabs = [
		{ value: 'all', label: 'All (30)' },
		{ value: 'flight', label: 'Flight (20)' },
		{ value: 'hotel', label: 'Hotel (5)' },
		{ value: 'train', label: 'Train (5)' },
		{ value: 'insurance', label: 'Insurance (5)' }
	];

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

	let activeTab = 'all';
</script>

<div class="w-full">
	<Tabs bind:value={activeTab} class="w-full">
		<div class="w-fit gap-0">
			{#each tabs as tab}
				<TabsTrigger
					value={tab.value}
					class={`data-[state=active]:text-primary border-b-2 px-4 py-2 text-sm transition-all duration-200 ${
						activeTab === tab.value ? 'shadow-2xl' : 'border-transparent'
					}`}
				>
					{tab.label}
				</TabsTrigger>
			{/each}
		</div>

		{#each tabs as tab}
			<TabsContent value={tab.value}>
				<div class="overflow-hidden rounded-lg border border-gray-200">
					<table class="w-full">
						<thead class="bg-gray-100">
							<tr class="text-left text-sm font-medium text-gray-700">
								<th class="px-4 py-3">Type</th>
								<th class="px-4 py-3">Product Name</th>
								<th class="px-4 py-3">Book Code</th>
								<th class="px-4 py-3">Route/City</th>
								<th class="px-4 py-3">Requested by</th>
								<th class="px-4 py-3">Expired in</th>
								<th class="px-4 py-3">Open</th>
							</tr>
						</thead>
						<tbody>
							{#each rows.filter((row) => tab.value === 'all' || row.type === tab.value) as row}
								<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
									<td class="px-4 py-3 font-medium capitalize">{row.type}</td>
									<td class="px-4 py-3">{row.productName}</td>
									<td class="px-4 py-3">{row.bookCode}</td>
									<td class="px-4 py-3">{row.routeCity}</td>
									<td class="px-4 py-3">
										<div>{row.requestedBy}</div>
										<div class="text-gray-500">{row.company}</div>
									</td>
									<td class="px-4 py-3">{row.expiredIn}</td>
									<td class="px-4 py-3">
										{#if row.open}
											<Icon icon="mdi:check" class="h-5 w-5 text-green-500" />
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</TabsContent>
		{/each}
	</Tabs>
</div>
