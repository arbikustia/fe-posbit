<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import Table from '../table.svelte';

	const myCompany = {
		name: 'RSP (Reka Sinergi Pratama)',
		code: 'COM00001',
		type: 'Head Office',
		address: 'Jakarta',
		parent: 'Site Administrator'
	};

	let search = '';

	const companies = [
		{
			name: 'Corp ABC 1',
			code: 'COM0002',
			type: 'Branch Office',
			city: 'Jakarta',
			parent: 'RSP (Reka Sinergi Pratama)'
		},
		{
			name: 'Corp ABC 2',
			code: 'COM0003',
			type: 'Sub Agent',
			city: 'Jakarta',
			parent: 'Comp DEF 1'
		},
		{
			name: 'Corp ABC 3',
			code: 'COM0004',
			type: 'Customer',
			city: 'Jakarta',
			parent: 'RSP (Reka Sinergi Pratama)'
		}
	];
</script>

<MOSGAppBar class="bg-blue-800 text-neutral-50">
	{#snippet leftContent()}
		<div class="w-[80vw] text-center text-lg font-semibold text-neutral-50">Company</div>
	{/snippet}
</MOSGAppBar>

<Card.Root>
	<Card.Content>
		<div class="mx-auto max-w-5xl space-y-10 pt-5">
			<!-- My Company -->
			<div>
				<h3 class="text-md mb-3 border-b-2 border-neutral-200 pb-2 font-semibold">My Company</h3>
				<div class="flex flex-col gap-3">
					<div class="justify- flex items-center text-start">
						<span class="w-[30%] text-gray-500">Name</span>{myCompany.name}
					</div>
					<div class="justify- flex items-center text-start">
						<span class="w-[30%] text-gray-500">Code</span>{myCompany.code}
					</div>
					<div class="justify- flex items-center text-start">
						<span class="w-[30%] text-gray-500">Type</span>{myCompany.type}
					</div>
					<div class="justify- flex items-center text-start">
						<span class="w-[30%] text-gray-500">Address</span>{myCompany.address}
					</div>
					<div class="justify- flex items-center text-start">
						<span class="w-[30%] text-gray-500">Parent Company</span>{myCompany.parent}
					</div>
				</div>
			</div>

			<!-- Managed Companies -->
			<div>
				<h3 class=" text-md border-b-2 border-neutral-200 pb-2 font-semibold">Managed Companies</h3>

				<div class="mt-2 mb-2 flex items-center justify-between">
					<div></div>
					<Input placeholder="Search" bind:value={search} class="w-[200px] text-sm" />
				</div>

				<Table />
			</div>
		</div>
	</Card.Content>
</Card.Root>
