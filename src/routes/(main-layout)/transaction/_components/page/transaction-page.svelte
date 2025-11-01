<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { toast } from 'svelte-sonner';
	import { cn } from '@/utils';
	import Button from '@/components/ui/button/button.svelte';
	import { FormModalAwal } from '../../../dashboard/_components/form-modal-awal';

	let { state: pageState = $bindable() }: any = $props();

	// 💰 Format IDR
	function formatCurrency(num: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			maximumFractionDigits: 0
		}).format(num || 0);
	}

	// 🔹 Hitung total harga semua produk
	$effect(() => {
		pageState.totalAll = pageState.itemTable.reduce(
			(sum: number, item: any) => sum + item.harga_jual * (item.qty || 1),
			0
		);
	});

	$effect(() => {
		pageState.discountNominal = (pageState.totalAll || 0) * ((pageState.discount || 0) / 100);
	});

	// 🔹 Hitung grand total mengikuti diskon persen
	$effect(() => {
		const discountRate = (pageState.discount || 0) / 100;
		pageState.grandTotal = pageState.totalAll * (1 - discountRate);
	});

	// 🔹 Fungsi untuk hapus item dari tabel
	function removeItem(barcode_id: any) {
		const before = pageState.itemTable.length;
		pageState.itemTable = pageState.itemTable.filter((i: any) => i.barcode_id !== barcode_id);

		if (pageState.itemTable.length < before) {
			toast.success('Item removed successfully');
		} else {
			toast.error('Item not found');
		}
	}
	let closingModal = $state(false);
	function closingFunc() {
		closingModal = true;
		console.log('Closing function triggered');
	}
</script>

{#if closingModal}
	<FormModalAwal type="uppdate" showModalAwal={closingModal} />
{/if}
<div class="flex gap-4">
	<div class="mx-auto w-full max-w-7xl">
		<!-- TABLE -->
		<div class=" h-72 overflow-auto rounded-lg border border-gray-200 shadow-sm">
			<table class="min-w-full over divide-y divide-gray-200">
				<thead class="sticky top-0 z-10 bg-gray-100">
					<tr class="text-left text-sm font-medium text-gray-700">
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">No</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Barcode</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Item Name</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Label</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Harga Jual</th>
						<th class="px-3 py-2.5 text-xs sm:px-4 sm:py-3 md:text-sm">Qty</th>
						<th class="px-3 py-2.5 text-center text-xs sm:px-4 sm:py-3 md:text-sm">Action</th>
					</tr>
				</thead>

				<tbody class="divide-y overflow-auto divide-gray-200 overflow-y-auto">
					{#if pageState.itemTable.length === 0}
						<tr>
							<td colspan="7" class="py-4 text-center text-sm text-gray-500">
								No items have been added
							</td>
						</tr>
					{:else}
						{#each pageState.itemTable as row, index}
							<tr class="transition hover:bg-gray-50">
								<td class="px-3 py-2.5 text-xs text-gray-500">{index + 1}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.barcode_id}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.name}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.label_name}</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">
									{formatCurrency(row.harga_jual)}
								</td>
								<td class="px-3 py-2.5 text-xs text-gray-900">{row.qty}</td>

								<!-- Tombol Delete -->
								<td class="px-3 py-2.5 text-center">
									<button
										onclick={() => removeItem(row.barcode_id)}
										class="rounded-md bg-red-100 px-2 py-1 text-xs font-medium text-red-600 transition hover:bg-red-200"
										use:Tooltip.Root
										data-tooltip="Delete item"
									>
										<Icon icon="mdi:delete-outline" width="16" height="16" />
									</button>
								</td>
							</tr>
						{/each}
					{/if}
				</tbody>
			</table>
		</div>
	</div>

	<!-- SIDE TRANSACTION DETAIL -->
	<div class="flex w-[35%] flex-col gap-4">
		<div class="h-fit rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
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
					<span class="font-semibold text-gray-900">{formatCurrency(pageState.totalAll || 0)}</span>
				</div>

				<div class="flex justify-between">
					<span class="font-medium text-gray-700">Discount (%)</span>
					<span class="font-semibold text-red-600">{pageState.discount || 0}%</span>
				</div>

				<div class="flex justify-between">
					<span class="font-medium text-gray-700">Discount (Rp)</span>
					<span class="font-semibold text-red-600"
						>{formatCurrency(pageState.discountNominal || 0)}</span
					>
				</div>

				<hr class="my-3 border-gray-200" />

				<div class="flex justify-between">
					<span class="font-semibold text-gray-800">Grand Total</span>
					<span class="font-bold text-blue-600">
						{formatCurrency(pageState.grandTotal || 0)}
					</span>
				</div>

				<div
					class={cn(
						'flex justify-between',
						pageState.paymentMethod === 'DEBIT' ? 'hidden' : 'flex'
					)}
				>
					<span class="font-semibold text-gray-800">Change</span>
					<span class="font-bold text-green-600">
						{pageState.amountPaid
							? formatCurrency((pageState.amountPaid || 0) - (pageState.grandTotal || 0))
							: 0}
					</span>
				</div>
			</div>
		</div>
		<Button variant="danger" onclick={closingFunc}>Closing</Button>
	</div>
</div>
