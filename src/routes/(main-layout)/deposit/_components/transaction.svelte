<script lang="ts">
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import { transactions } from '$lib/dummy/deposit.json';
	import { Input } from '$lib/components/ui/input';
	import { OSGPresetDatePicker } from '$lib/components/opsigo-ui/preset-date-picker';

	let filters = $state({
		transactionDate: { start: undefined, end: undefined },
		transactionProvider: { start: undefined, end: undefined },
		transactionType: { start: undefined, end: undefined },
		keyword: ''
	});
</script>

<div class="transaction-history">
	<!-- Filters -->
	<div class="mt-4 grid grid-cols-4 gap-2 text-sm">
		<OSGPresetDatePicker
			triggerClass="w-full"
			bind:value={filters.transactionDate}
			placeholder="All Days"
		/>
		<OSGPresetDatePicker
			triggerClass="w-full"
			bind:value={filters.transactionProvider}
			placeholder="All Provider"
		/>
		<OSGPresetDatePicker
			triggerClass="w-full"
			bind:value={filters.transactionType}
			placeholder="All Transaction"
		/>
		<div class="relative w-full">
			<Icon icon="ri:search-line" class="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
			<Input type="text" placeholder="Keyword" class="pl-8" />
		</div>
	</div>
	{#each Array.from(new Set(transactions.map((t) => t.date))) as date}
		{@render transactionItems(date)}
	{/each}
	<div class="py-4 text-center">
		<button type="button" class="text-sm font-medium">See more</button>
	</div>
</div>

{#snippet transactionItems(date: string)}
	<div class="transaction-list">
		<div class="date-parent">
			{dayjs(date).format('ddd, DD MMM YYYY')}
		</div>
		{#each transactions.filter((t) => t.date === date) as tx}
			<div class="items">
				<div class="flex gap-3">
					<div class={['tx-icon', tx.type]}>
						<Icon icon={tx.icon} class="text-sm md:text-lg" />
					</div>
					<div>
						<div class="text-sm font-medium">
							{tx.title}
							{#if tx.code}
								<span class="tx-code">{tx.code}</span>
							{/if}
						</div>
						<div class="text-xs text-gray-500">{tx.subtitle}</div>
					</div>
				</div>
				<div class="amount {tx.amount < 0 ? 'text-red-500' : 'text-green-600'}">
					{(tx.amount < 0 ? '-' : '+') + Math.abs(tx.amount).toLocaleString()} IDR
					<div class="text-xs text-gray-400">{tx.time}</div>
				</div>
			</div>
		{/each}
	</div>
{/snippet}

<style>
	@reference "$appCss";
	.transaction-list {
		@apply mt-6;
	}
	.transaction-list > .date-parent {
		@apply mb-2 text-sm font-semibold text-gray-500;
	}
	.transaction-list > .items {
		@apply flex items-start justify-between border-t border-[#CFCFCF] py-3;
	}
	.amount {
		@apply text-right text-sm font-semibold;
	}
</style>
