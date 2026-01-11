<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { goto } from '$app/navigation';
	import { useDashboardInventory } from './use-highlight-gudang.svelte';

	// Props diterima dari parent (Dashboard)
	const { state } = $props();
	// const {state: dashboardState} = useDashboardInventory()
	
</script>

<div class="highlight-card">
	<!-- Total Penjualan Bulan Ini -->
	<Card.Root onclick={() => goto(`/dashboard/stock-gudang?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:warehouse" class="text-2xl text-emerald-500 md:text-2xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Total Stock Gudang
				</Card.Description>
			</div>
			<Card.Title class="text-2xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.stock_all_gudang ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Transaksi -->
	<Card.Root onclick={() => goto(`/dashboard/total-barang-masuk?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:package-down" class="text-2xl text-blue-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Total Barang Masuk
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.stock_in_gudang ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Pelanggan Baru -->
	<Card.Root onclick={() => goto(`/dashboard/total-barang-keluar?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:package-up" class="text-2xl text-amber-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Total Barang Keluar
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.stock_out_gudang ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root onclick={() => goto(`/dashboard/out-toko?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:store-off-outline" class="text-2xl text-blue-800 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Out Toko
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.out_toko ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root onclick={() => goto(`/dashboard/stock-jahit-label?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:needle" class="text-2xl text-amber-800 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Stock Jahit label
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.stock_jahit_label ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root onclick={() => goto(`/dashboard/stock-delivery?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:truck-delivery" class="text-2xl text-pink-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Stock Delivery
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.stock_delivery ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root onclick={() => goto(`/dashboard/out-customer?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:account-arrow-right-outline" class="text-2xl text-purple-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Out Customer
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.out_customer ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<Card.Root onclick={() => goto(`/dashboard/barang-ng?Start=${state.startDate}&End=${state.endDate}`)} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="streamline-flex:incorrect-password-remix" class="text-2xl text-red-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Barang NG
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.total_ng ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>
	<!-- <Card.Root onclick={() => goto('/dashboard/stock-sample')} class="@container/card h-fit min-h-28 p-0 cursor-pointer">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="streamline-flex:incorrect-password-remix" class="text-2xl text-red-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Stock Sample
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state.list.stock_sample ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root> -->
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3;
	}
</style>
