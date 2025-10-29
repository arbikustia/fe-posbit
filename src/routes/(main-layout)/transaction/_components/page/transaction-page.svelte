<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { useTransactionForm } from '../../form.svelte';
	import { cn } from '@/utils';

	let { state = $bindable() }: any = $props();

	// 🔍 Debug: pantau perubahan tabel
	$effect(() => {
		console.log('🧾 item table changes:', state.itemTable);
	});

	function formatCurrency(num: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(num || 0);
	}

	// 🔹 Hitung total harga semua produk
	$effect(() => {
		state.totalAll = state.itemTable.reduce(
			(sum: number, item: any) => sum + item.harga_jual * (item.qty || 1),
			0
		);
	});

	// 🔹 Hitung grand total mengikuti diskon persen
	$effect(() => {
		const discountRate = (state.discount || 0) / 100;
		state.grandTotal = state.totalAll * (1 - discountRate);
	});
</script>

<div class="flex gap-4">
	<div class="mx-auto w-full max-w-7xl">
		<!-- TABLE -->
		<div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
			<table class="min-w-full divide-y divide-gray-200">
				<thead class="bg-gray-100">
					<tr class="text-left text-sm font-medium text-gray-700">
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">No</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Barcode</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Item Name</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Label</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Harga Jual</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Qty</th>
					</tr>
				</thead>

				<tbody class="divide-y divide-gray-200 bg-white">
					{#if state.itemTable.length === 0}
						<tr>
							<td colspan="6" class="py-4 text-center text-sm text-gray-500">
								No items have been added
							</td>
						</tr>
					{:else}
						{#each state.itemTable as row, index}
							<tr class="transition hover:bg-gray-50">
								<td class="px-3 py-2.5 text-xs text-gray-500">{index + 1}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.barcode_id}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.name}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.label_name}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">
									{formatCurrency(row.harga_jual)}
								</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.qty}</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- SIDE TRANSACTION DETAIL -->
	<div class="w-[35%] rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
		<div class="mb-4 flex items-start justify-between gap-2">
			<div class="flex items-center gap-2">
				<div class="bg-primary/10 rounded-md p-1.5">
					<Icon icon="hugeicons:transaction-history" width="24" height="24" />
				</div>
				<h2 class="text-[15px] font-semibold text-gray-800">Transaction Summary</h2>
			</div>
		</div>

		<!-- DETAIL LIST -->
		<div class="space-y-3 text-sm">
			<div class="flex justify-between">
				<span class="font-medium text-gray-700">Total Products</span>
				<span class="font-semibold text-gray-900">{formatCurrency(state.totalAll || 0)}</span>
			</div>

			<!-- DISCOUNT (AS PERCENT) -->
			<div class="flex justify-between">
				<span class="font-medium text-gray-700">Discount (%)</span>
				<span class="font-semibold text-red-600">{state.discount || 0}%</span>
			</div>

			<hr class="my-3 border-gray-200" />

			<!-- GRAND TOTAL -->
			<div class="flex justify-between">
				<span class="font-semibold text-gray-800">Grand Total</span>
				<span class="font-bold text-blue-600">
					{formatCurrency(state.grandTotal || 0)}
				</span>
			</div>

			<!-- CHANGE -->
			<div class={cn("flex justify-between", state.paymentMethod === 'DEBIT' ? 'hidden' : 'flex')}>
				<span class="font-semibold text-gray-800">Change</span>
				<span class="font-bold text-green-600">
					{formatCurrency((state.amountPaid || 0) - (state.grandTotal || 0))}
				</span>
			</div>
		</div>
	</div>
</div>
