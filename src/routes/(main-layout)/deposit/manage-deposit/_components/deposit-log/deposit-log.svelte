<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Icon from '@iconify/svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
</script>

<div class="flex w-full flex-col items-end justify-between">
	<div class="flex w-full justify-between">
		<div class="flex flex-col">
			<div class="text-lg font-medium">Deposit Log</div>
			<div class="text-md font-normal">60 Data</div>
		</div>
		<Button variant="outline">
			<Icon icon="vscode-icons:file-type-excel" width="32" height="32" />
			<span> Export to Excel </span>
		</Button>
	</div>
	<div class="mt-3 flex w-full justify-between">
		<div class="flex items-center justify-center gap-2 rounded-md border px-2 py-2">
			<Icon icon="mingcute:search-line" width="16" height="16" style="color: #454545" />
			<input
				class="in-focus:outline-none w-56 border-none bg-transparent outline-none"
				placeholder="Search a company..."
			/>
		</div>
		<div class="flex gap-2">
			<Select.Root type="single">
				<Select.Trigger class="w-[180px]">All Company</Select.Trigger>
				<Select.Content>
					<Select.Item value="light">Light</Select.Item>
					<Select.Item value="dark">Dark</Select.Item>
					<Select.Item value="system">System</Select.Item>
				</Select.Content>
			</Select.Root>
			<Select.Root type="single">
				<Select.Trigger class="w-[180px]">All Type</Select.Trigger>
				<Select.Content>
					<Select.Item value="light">Light</Select.Item>
					<Select.Item value="dark">Dark</Select.Item>
					<Select.Item value="system">System</Select.Item>
				</Select.Content>
			</Select.Root>
			<Select.Root type="single">
				<Select.Trigger class="w-[180px]">All Produtc</Select.Trigger>
				<Select.Content>
					<Select.Item value="light">Light</Select.Item>
					<Select.Item value="dark">Dark</Select.Item>
					<Select.Item value="system">System</Select.Item>
				</Select.Content>
			</Select.Root>
			<div class="w-44 rounded-md border">
				<OSGDatePicker class="h-8 w-44 border py-0" iconClass="text-text" />
			</div>
			<Button variant="outline">Reset</Button>
		</div>
	</div>
</div>
<div class="mt-5 flex flex-col items-end justify-end rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="text-center">No</Table.Head>
				<Table.Head class="text-center">Date/Time</Table.Head>
				<Table.Head class="text-center">Company</Table.Head>
				<Table.Head class="text-center">Type</Table.Head>
				<Table.Head class="text-center">Product</Table.Head>
				<Table.Head class="text-center">Currency</Table.Head>
				<Table.Head class="text-center">Amount</Table.Head>
				<Table.Head class="text-center">Description</Table.Head>
				<Table.Head class="text-center">Modified by</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="text-center">1.</Table.Cell>
				<Table.Cell class="text-center">
					<span>22-07-2025</span>
					<span>13:01:02</span>
				</Table.Cell>
				<Table.Cell class="text-center">Bank Indonesia KPW A</Table.Cell>
				<Table.Cell class="text-center">
					<div class="w-full rounded-full bg-green-600 py-1 font-medium text-white">DEDUCT</div>
				</Table.Cell>
				<Table.Cell class="text-center">Insurance</Table.Cell>
				<Table.Cell class="text-center">IDR</Table.Cell>
				<Table.Cell>1,000,000,000.00</Table.Cell>
				<Table.Cell class="w-44">
					<div class="overflow-hidden text-ellipsis whitespace-normal break-words">
						Deduct Deposit for Tours with booking code : JTWNE3, Status : Paid
					</div>
				</Table.Cell>
				<Table.Cell>audrey.wijaya@opsigo.com</Table.Cell>
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
