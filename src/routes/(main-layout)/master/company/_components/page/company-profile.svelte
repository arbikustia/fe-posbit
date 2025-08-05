<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card';
	import Table from '../table.svelte';

	const myCompany = {
		name: 'RSP (Reka Sinergi Pratama)',
		code: 'COM00001',
		type: 'Head Office',
		address: 'Jakarta',
		parent: 'Site Administrator'
	};

	let search = '';
</script>

<div class="container">
	<Card.Root>
		<Card.Content>
			<div class="mx-auto max-w-5xl space-y-10">
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
					<h3 class=" text-md border-b-2 border-neutral-200 pb-2 font-semibold">
						Managed Companies
					</h3>

					<div class="mt-2 mb-2 flex items-center justify-between">
						<div></div>
						<Input placeholder="Search" bind:value={search} class="w-[200px] text-sm" />
					</div>

					<Table />
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
