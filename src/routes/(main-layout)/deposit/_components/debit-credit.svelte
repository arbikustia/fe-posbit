<script lang="ts">
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import { dcData } from '$lib/dummy/deposit.json';
</script>

<div class="debit-credit">
	<div class="dc-info">
		<div>
			<div>Company : <span class="font-medium">{dcData.company}</span></div>
			<div>Currency : <span class="font-medium">{dcData.currency}</span></div>
		</div>
		<div class="text-right">
			<div>
				Starting Balance :
				<span class="font-medium">
					{dcData.startingBalance.toLocaleString()}
				</span>
			</div>
			<div>
				Ending Balance :
				<span class="font-medium">
					{dcData.endingBalance.toLocaleString()}
				</span>
			</div>
		</div>
	</div>

	{@render dcHistory()}
</div>

{#snippet dcHistory()}
	<div class="dc-table">
		<table>
			<thead>
				<tr>
					<th>Type</th>
					<th>Transaction Date</th>
					<th>Description</th>
					<th class=" text-center">Amount</th>
					<th class=" text-right">Balance</th>
				</tr>
			</thead>
			<tbody>
				{#each dcData.transactions as tx}
					<tr>
						<td class="text-xl">
							<div class={['tx-icon', tx.type]}>
								<Icon icon={tx.icon} class="text-sm md:text-lg" />
							</div>
						</td>
						<td>
							<span class="font-medium">
								{dayjs(tx.date).format('ddd, DD MMM YYYY')}
							</span>
							<span class="text-xs text-gray-500">{tx.time}</span>
						</td>
						<td>
							<div class="font-medium">
								{tx.title}
								{#if tx.code}
									<span class="tx-code">{tx.code}</span>
								{/if}
							</div>
							<div class="text-xs text-gray-500">{tx.subtitle}</div>
						</td>
						<td
							class="text-right font-semibold {tx.type === 'debit'
								? 'text-red-500'
								: 'text-green-600'}"
						>
							{tx.type === 'debit' ? 'DB' : 'CR'}
							{tx.amount.toLocaleString()}
						</td>
						<td class="text-right text-gray-700">{tx.balance.toLocaleString()}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}

<style>
	@reference "$appCss";
	.dc-info {
		@apply my-4 flex justify-between text-sm text-gray-700;
	}
	.dc-table {
		@apply overflow-x-auto rounded-lg border;
	}
	.dc-table > table {
		@apply min-w-full text-sm;
	}
	.dc-table > table > thead {
		@apply bg-gray-100 text-left font-semibold;
	}
	.dc-table > table > thead > tr > th {
		@apply px-4 py-2;
	}
	.dc-table > table > tbody > tr {
		@apply border-t;
	}
	.dc-table > table > tbody > tr > td {
		@apply px-4 py-3;
	}
</style>
