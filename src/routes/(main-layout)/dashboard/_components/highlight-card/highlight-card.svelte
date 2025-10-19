<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';
</script>

<div class="highlight-card">
	<!-- Total Penjualan Bulan Ini -->
	<Card.Root class="@container/card">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center md:justify-start gap-2">
				<Icon icon="mdi:cash-multiple" class="text-2xl md:text-2xl text-emerald-500" />
				<Card.Description class="text-lg md:text-sm text-center md:text-left">
					Total Penjualan Bulan Ini
				</Card.Description>
			</div>
			<Card.Title class="text-2xl md:text-2xl lg:text-3xl font-semibold tabular-nums">
				Rp 100.000.000
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Transaksi -->
	<Card.Root class="@container/card">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center md:justify-start gap-2">
				<Icon icon="mdi:cart-outline" class="text-2xl md:text-3xl text-blue-500" />
				<Card.Description class="text-lg md:text-sm text-center md:text-left">
					Jumlah Transaksi
				</Card.Description>
			</div>
			<Card.Title class="text-4xl md:text-2xl lg:text-3xl font-semibold tabular-nums">128</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Pelanggan Baru -->
	<Card.Root class="@container/card">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center md:justify-start gap-2">
				<Icon icon="mdi:account-plus-outline" class="text-2xl md:text-3xl text-amber-500" />
				<Card.Description class="text-lg md:text-sm text-center md:text-left">
					Jumlah Pelanggan Baru
				</Card.Description>
			</div>
			<Card.Title class="text-4xl md:text-2xl lg:text-3xl font-semibold tabular-nums">47</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Penjualan Item Terbanyak -->
	<Card.Root class="@container/card">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center md:justify-start gap-2">
				<Icon icon="iconoir:bright-star" class="text-2xl md:text-3xl text-yellow-500" />
				<Card.Description class="text-lg md:text-sm text-center md:text-left">
					Penjualan Item Terbanyak
				</Card.Description>
			</div>

			<div class="text-center md:text-left">
				<div class="text-xl md:text-xl font-semibold">Celana Cargo</div>
				<div class="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
					<span
						class="bg-primary/10 border-primary rounded-full border px-2 py-0.5 text-xs md:text-sm font-medium"
						>Qty 354</span
					>
					<span
						class="bg-primary/10 border-primary rounded-full border px-2 py-0.5 text-xs md:text-sm font-medium"
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
		@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full;
	}
</style>
