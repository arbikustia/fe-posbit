<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { Input } from '$lib/components/ui/input/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Icon from '@iconify/svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
</script>

<div class="flex w-full items-end justify-between">
	<div class="flex flex-col gap-5">
		<div class="flex flex-col">
			<div class="text-lg font-medium">Request for Approval</div>
		</div>
		<div class="flex items-center justify-center gap-2 rounded-md border px-2 py-2">
			<Icon icon="mingcute:search-line" width="16" height="16" style="color: #454545" />
			<input
				class="in-focus:outline-none w-56 border-none bg-transparent outline-none"
				placeholder="Search a company..."
			/>
		</div>
	</div>
</div>
<div class="mt-5 flex flex-col items-end justify-end rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="text-center">Date/Time</Table.Head>
				<Table.Head class="text-center">Company</Table.Head>
				<Table.Head class="text-center">Request Type</Table.Head>
				<Table.Head class="text-center">Requested by</Table.Head>
				<Table.Head class="text-center">Currency</Table.Head>
				<Table.Head class="text-center">Amount</Table.Head>
				<Table.Head class="text-center">Description and Attachment</Table.Head>
				<Table.Head class="text-center">Action</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="text-center">
					<div class="flex flex-col">
						<span>22-07-2025</span>
						<span>13:01:02</span>
					</div>
				</Table.Cell>
				<Table.Cell class="text-center">Bank Indonesia KPW A</Table.Cell>
				<Table.Cell class="text-center">DEDUCT</Table.Cell>
				<Table.Cell class="text-center">
					<div class="flex flex-col">
						<span>audrey.wijaya@opsigo.com</span>
						<span>RSP (Reka Sinergi Pratama)</span>
					</div>
				</Table.Cell>
				<Table.Cell class="text-center">IDR</Table.Cell>
				<Table.Cell class="text-center">1,000,000,000.00</Table.Cell>
				<Table.Cell>
					<div class="flex flex-col justify-center">
						<span>Test Request</span>
						<span>Request deposit.pdf</span>
					</div>
				</Table.Cell>
				<Table.Cell>
					<div class="flex justify-center gap-1">
						<Button variant="outline">
							<Icon
								icon="material-symbols:check-rounded"
								width="24"
								height="24"
								style="color: #1dea0a"
							/>
						</Button>
						<Button variant="outline">
							<Icon
								icon="material-symbols:close-rounded"
								width="24"
								height="24"
								style="color: #d52500"
							/>
						</Button>
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

<Separator class="my-10" />
<div class="flex w-full items-end justify-between">
	<div class="flex flex-col gap-5">
		<div class="flex flex-col">
			<div class="text-lg font-medium">Approval History</div>
		</div>
		<div class="flex items-center justify-center gap-2 rounded-md border px-2 py-2">
			<Icon icon="mingcute:search-line" width="16" height="16" style="color: #454545" />
			<input
				class="in-focus:outline-none w-56 border-none bg-transparent outline-none"
				placeholder="Search a company..."
			/>
		</div>
	</div>
</div>
<div class="mt-5 flex flex-col items-end justify-end rounded-md border">
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head class="text-center">Date/Time</Table.Head>
				<Table.Head class="text-center">Company</Table.Head>
				<Table.Head class="text-center">Request Type</Table.Head>
				<Table.Head class="text-center">Requested by</Table.Head>
				<Table.Head class="text-center">Currency</Table.Head>
				<Table.Head class="text-center">Amount</Table.Head>
				<Table.Head class="text-center">Description and Attachment</Table.Head>
				<Table.Head class="text-center">Status</Table.Head>
				<Table.Head class="text-center">Detail</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			<Table.Row>
				<Table.Cell class="text-center">
					<div class="flex flex-col">
						<span>22-07-2025</span>
						<span>13:01:02</span>
					</div>
				</Table.Cell>
				<Table.Cell class="text-center">Bank Indonesia KPW A</Table.Cell>
				<Table.Cell class="text-center">DEDUCT</Table.Cell>
				<Table.Cell class="text-center">
					<div class="flex flex-col">
						<span>audrey.wijaya@opsigo.com</span>
						<span>RSP (Reka Sinergi Pratama)</span>
					</div>
				</Table.Cell>
				<Table.Cell class="text-center">IDR</Table.Cell>
				<Table.Cell class="text-center">1,000,000,000.00</Table.Cell>
				<Table.Cell>
					<div class="flex flex-col justify-center">
						<span>Test Request</span>
						<span>Request deposit.pdf</span>
					</div>
				</Table.Cell>
				<Table.Cell>
					<div
						class="flex items-center justify-center gap-1 rounded-full border border-red-600 bg-red-400/20 py-1"
					>
						<Icon
							icon="material-symbols:close-rounded"
							width="16"
							height="16"
							style="color: #d52500"
						/>
						<span class="text-md">Rejected</span>
					</div>
				</Table.Cell>
				<Table.Cell>
					<div class="flex items-center justify-center">
						<Icon icon="majesticons:open-line" width="20" height="20" style="color: #3e3d3d" />
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
