<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';
</script>

<div class="highlight-card">
	<!-- Total Penjualan Bulan Ini -->
	<Card.Root class="@container/card ">
		<Card.Header class="flex  flex-col items-center space-y-2">
			<div class="flex w-full items-center gap-2">
				<Icon icon="mdi:cash-multiple" class="text-2xl text-emerald-500" />
				<Card.Description>Total Penjualan Bulan Ini</Card.Description>
			</div>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
				Rp 100.000.000
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Transaksi -->
	<Card.Root class="@container/card ">
		<Card.Header class="flex  flex-col items-center space-y-2">
			<div class="flex w-full items-center gap-2">
				<Icon icon="mdi:cart-outline" class="text-2xl text-blue-500" />
				<Card.Description>Jumlah Transaksi</Card.Description>
			</div>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">128</Card.Title
			>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Pelanggan Baru -->
	<Card.Root class="@container/card ">
		<Card.Header class="flex flex-col items-center space-y-2">
			<div class="flex w-full items-center gap-2">
				<Icon icon="mdi:account-plus-outline" class="text-2xl text-amber-500" />
				<Card.Description>Jumlah Pelanggan Baru</Card.Description>
			</div>
			<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">47</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Penjualan Item Terbanyak -->
	<Card.Root class="@container/card ">
		<Card.Header class="flex flex-col items-center space-y-2">
			<div class="flex w-full items-center gap-2">
				<!-- <Icon icon="mdi:gold" class="text-2xl text-yellow-500" /> -->
				<Icon icon="iconoir:bright-star" class="text-2xl text-yellow-500" />
				<Card.Description>Penjualan Item Terbanyak</Card.Description>
			</div>

			<div>
				<div>
					<div class="text-xl text-center font-semibold">Celana Cargo</div>
					<span class="bg-primary/10 border-primary rounded-full border px-2 text-xs font-medium"
						>Qty 354</span
					>
					<span class="bg-primary/10 border-primary rounded-full border px-2 text-xs font-medium"
						>Rp 45.000.000</span
					>
				</div>
			</div>
		</Card.Header>
	</Card.Root>
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4;
	}
</style>
