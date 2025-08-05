<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';

	interface travelerType {
		title: string;
		name: string;
		company: string;
		phone: string;
		country: string;
	}

	const travelers: travelerType[] = [
		{
			title: 'MR',
			name: 'John Doe',
			company: 'RSP (Reka Sinergi Pratama)',
			phone: '6281231231234',
			country: 'Indonesia'
		},
		{
			title: 'MR',
			name: 'John Doe',
			company: 'RSP (Reka Sinergi Pratama)',
			phone: '6281231231234',
			country: 'Indonesia'
		},
		{
			title: 'MR',
			name: 'John Doe',
			company: 'RSP (Reka Sinergi Pratama)',
			phone: '6281231231234',
			country: 'Indonesia'
		}
	];

	// Pagination state
	let currentPage = 1;
	const itemsPerPage = 3;
	const totalPages = Math.ceil(travelers.length / itemsPerPage);

	$: paginatedCompanies = travelers.slice(
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
				<Table.Head>Title</Table.Head>
				<Table.Head>Name</Table.Head>
				<Table.Head>Company</Table.Head>
				<Table.Head>Phone</Table.Head>
				<Table.Head>Country Company</Table.Head>
			</Table.Row>
		</Table.Header>

		<Table.Body>
			{#each paginatedCompanies as company}
				<Table.Row>
					<Table.Cell>{company.title}</Table.Cell>
					<Table.Cell>{company.name}</Table.Cell>
					<Table.Cell>{company.company}</Table.Cell>
					<Table.Cell>{company.phone}</Table.Cell>
					<Table.Cell>{company.country}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>

	<!-- Pagination -->
	<div class="flex items-center justify-center space-x-2">
		<Button
			variant="outline"
			class="rounded-md border px-3 h-8 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
			disabled={currentPage === 1}
			onclick={() => goToPage(currentPage - 1)}
		>
			‹
		</Button>

		{#each Array.from({ length: totalPages }, (_, i) => i + 1) as page}
			<Button
				variant="default"
				class="hover:text-black border px-3 h-8 text-sm hover:bg-gray-50 {currentPage === page
					? 'text-white'
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
