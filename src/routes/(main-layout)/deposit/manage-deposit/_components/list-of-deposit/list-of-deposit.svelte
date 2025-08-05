<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Icon from '@iconify/svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
</script>

<div class="flex w-full items-end justify-between">
	<div class="flex flex-col gap-5">
		<div class="flex flex-col">
			<div class="text-lg font-medium">List of Deposit</div>
			<div class="text-md font-normal">60 Data</div>
		</div>
		<div class="border py-2 rounded-md gap-2 flex items-center justify-center px-2">
			<Icon icon="mingcute:search-line" width="16" height="16" style="color: #454545" />
			<input
				class="w-56 border-none in-focus:outline-none bg-transparent outline-none"
				placeholder="Search a company..."
			/>
		</div>
	</div>
	<div>
		<Button variant="outline">
			<Icon icon="vscode-icons:file-type-excel" width="32" height="32" />
			<span> Export to Excel </span>
		</Button>
		<Button variant="outline">
			<Icon icon="tabler:plus" width="24" height="24" style="color: #454545" />
			<span>Create</span>
		</Button>
	</div>
</div>
<div class="mt-5 flex flex-col items-end justify-end rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="text-center">No</Table.Head>
				<Table.Head class="text-center">Company</Table.Head>
				<Table.Head class="text-center">Currency</Table.Head>
				<Table.Head class="text-center">Effective Deposit</Table.Head>
				<Table.Head class="text-center">Current Deposit</Table.Head>
				<Table.Head class="text-center">Minimum Deposit</Table.Head>
				<Table.Head class="text-center">Active</Table.Head>
				<Table.Head class="text-center">Menu</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="text-center">1.</Table.Cell>
				<Table.Cell class="text-center">Bank Indonesia KPW A</Table.Cell>
				<Table.Cell class="text-center">IDR</Table.Cell>
				<Table.Cell class="text-center">1,000,000,000.00</Table.Cell>
				<Table.Cell class="text-center">1,000,000,000.00</Table.Cell>
				<Table.Cell class="text-center">0</Table.Cell>
				<Table.Cell>
					<div class="flex justify-center">
						<Checkbox />
					</div>
				</Table.Cell>
				<Table.Cell>
					<div class="flex justify-center">
						<Icon icon="mage:dots" width="16" height="16" style="color: #454545" />
					</div>
				</Table.Cell>
			</Table.Row>
		</Table.Body>
	</Table.Root>
</div>
<div class="mt-5 flex justify-between">
	<span class="w-full text-neutral-400">Show 1-25 of 60</span>
	<Pagination.Root count={100} perPage={10} class=" flex justify-end">
		{#snippet children({ pages, currentPage })}
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
		{/snippet}
	</Pagination.Root>
</div>
