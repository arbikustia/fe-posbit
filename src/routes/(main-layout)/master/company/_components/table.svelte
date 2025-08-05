<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	interface Company {
		name: string;
		code: string;
		type: string;
		city: string;
		parentCompany: string;
	}

	const companies: Company[] = [
		{
			name: 'Corp ABC 1',
			code: 'COM0002',
			type: 'Branch Office',
			city: 'Jakarta',
			parentCompany: 'RSP (Reka Sinergi P...'
		},
		{
			name: 'Corp ABC 2',
			code: 'COM0003',
			type: 'Sub Agent',
			city: 'Jakarta',
			parentCompany: 'Comp DEF 1'
		},
		{
			name: 'Corp ABC 3',
			code: 'COM0004',
			type: 'Customer',
			city: 'Jakarta',
			parentCompany: 'RSP (Reka Sinergi P...'
		},
		{
			name: 'Corp XYZ 1',
			code: 'COM0005',
			type: 'Branch Office',
			city: 'Bandung',
			parentCompany: 'RSP (Reka Sinergi P...'
		},
		{
			name: 'Corp XYZ 2',
			code: 'COM0006',
			type: 'Customer',
			city: 'Surabaya',
			parentCompany: 'Comp DEF 1'
		}
	];

	// Pagination state
	let currentPage = 1;
	const itemsPerPage = 3;
	const totalPages = Math.ceil(companies.length / itemsPerPage);

	$: paginatedCompanies = companies.slice(
		(currentPage - 1) * itemsPerPage,
		currentPage * itemsPerPage
	);

	function goToPage(page: number) {
		if (page >= 1 && page <= totalPages) {
			currentPage = page;
		}
	}
</script>

<div class="w-full space-y-4">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Company Name</Table.Head>
				<Table.Head>Company Code</Table.Head>
				<Table.Head>Type</Table.Head>
				<Table.Head>City</Table.Head>
				<Table.Head>Parent Company</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each paginatedCompanies as company}
				<Table.Row>
					<Table.Cell>
						{company.name}
					</Table.Cell>
					<Table.Cell>
						{company.code}
					</Table.Cell>
					<Table.Cell>
						{company.type}
					</Table.Cell>
					<Table.Cell>
						{company.city}
					</Table.Cell>
					<Table.Cell>
						{company.parentCompany}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<!-- Pagination -->
	<div class="flex items-center justify-center space-x-2">
		<Button
			variant="outline"
			class="h-8 rounded-md border px-3 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={currentPage === 1}
			onclick={() => goToPage(currentPage - 1)}
		>
			‹
		</Button>

		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
			<Button
				variant="default"
				class="h-8 border px-3 text-sm hover:bg-gray-50 hover:text-black {currentPage === page
					? 'text-white '
					: ''}"
				onclick={() => goToPage(page)}
			>
				{page}
			</Button>
		{/each}

		<Button
			variant="outline"
			class="h-8 rounded-md border px-3 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={currentPage === totalPages}
			onclick={() => goToPage(currentPage + 1)}
		>
			›
		</Button>
	</div>
</div>
