<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Tabs from '$lib/components/ui/tabs';
	import Icon from '@iconify/svelte';
	import { balance } from '$lib/dummy/deposit.json';
	import { OSGPresetDatePicker } from '$lib/components/opsigo-ui/preset-date-picker';
	import TransactionHistory from './_components/transaction.svelte';
	import DebitCredit from './_components/debit-credit.svelte';
	import type { DateRange } from 'bits-ui';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	let activeTab = $state('transaction');
	const tabList = [
		{ key: 'transaction', label: 'Transaction History' },
		{ key: 'debit', label: 'Debit Credit' }
	];
	let transactionDateDc = $state<DateRange>({
		start: undefined,
		end: undefined
	});
</script>

<div class="deposit-page">
	<div class="relative container -mt-[210px] md:px-40">
		<div class="deposit-info">
			<div>
				<div class="mb-2 text-xl">Deposit</div>
				<div class="text-3xl font-semibold">{balance.toLocaleString()} IDR</div>
			</div>
			<Button variant="outline" class="bg-transparent px-5 text-base font-bold">Top-up</Button>
		</div>

		<!-- Deposit Card -->
		<div class="deposit-card">
			<div class="px-4 pt-2">
				<Tabs.Root bind:value={activeTab} class="w-full">
					<div class="flex items-center justify-between gap-10">
						<Tabs.List class="flex space-x-4 bg-transparent">
							{#each tabList as view (view.key)}
								<Tabs.Trigger
									value={view.key}
									class="h-10 rounded-none border-0 font-semibold data-[state=active]:!border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none"
								>
									{view.label}
								</Tabs.Trigger>
							{/each}
						</Tabs.List>
						{#if activeTab === 'debit'}
							<OSGPresetDatePicker
								triggerClass="w-full flex-auto"
								bind:value={transactionDateDc}
								placeholder="All Days"
							/>
						{/if}
						{#if activeTab === 'transaction'}
							<DropdownMenu.Root>
								<DropdownMenu.Trigger>
									<Icon icon="lucide:sort-desc" class="text-xl" />
								</DropdownMenu.Trigger>
								<DropdownMenu.Content>
									<DropdownMenu.Group>
										<DropdownMenu.Item>Newest</DropdownMenu.Item>
										<DropdownMenu.Item>Oldest</DropdownMenu.Item>
									</DropdownMenu.Group>
								</DropdownMenu.Content>
							</DropdownMenu.Root>
						{/if}
					</div>

					<!-- Transactions List -->
					<Tabs.Content value="transaction" class="min-h-[400px]">
						<TransactionHistory />
					</Tabs.Content>

					<!-- Debit-Credit List -->
					<Tabs.Content value="debit" class="min-h-[400px]">
						<DebitCredit />
					</Tabs.Content>
				</Tabs.Root>
			</div>
		</div>
	</div>
</div>

<style>
	@reference "$appCss";
	.deposit-page::before {
		background: linear-gradient(180deg, #497ee0 6.25%, #76a6ff 59.13%);
		@apply relative block h-[200px] w-full content-[""];
	}
	.deposit-info {
		@apply mx-auto flex items-center justify-between text-white;
	}
	.deposit-card {
		@apply mt-8 overflow-hidden rounded-2xl bg-white shadow-md;
	}
	:global {
		.tx-code {
			@apply ml-2 rounded-4xl bg-[#E0E0E0] px-2 font-mono text-xs text-black;
		}
		.tx-icon {
			@apply flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#D9D9D9];
		}
		.tx-icon.credit {
			@apply bg-[#00B831] text-white;
		}
	}
</style>
