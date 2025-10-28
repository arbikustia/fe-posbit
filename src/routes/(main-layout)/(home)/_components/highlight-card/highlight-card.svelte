<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';

	// Props diterima dari parent (Dashboard)
	const { state } = $props();
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
				Rp {state?.summary?.total_sale?.toLocaleString('id-ID') ?? 0}
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
			<Card.Title class="text-4xl md:text-2xl lg:text-3xl font-semibold tabular-nums">
				{state?.summary?.total_tTransaction ?? 0}
			</Card.Title>
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
			<Card.Title class="text-4xl md:text-2xl lg:text-3xl font-semibold tabular-nums">
				{state?.summary?.new_customer ?? 0}
			</Card.Title>
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

			{#if state?.summary?.top_five?.length > 0}
				<div class="flex flex-col w-full gap-3 overflow-y-auto max-h-56">
					{#each state.summary.top_five.slice(0, 5) as item}
						<div class="flex flex-col border-b border-border pb-2 last:border-none">
							<div class="text-base md:text-lg font-semibold truncate text-center md:text-left">
								{item?.name ?? 'Unknown Item'}
							</div>
							<div class="flex flex-wrap justify-center md:justify-start gap-2 mt-1">
								<span
									class="bg-primary/10 border-primary rounded-full border px-2 py-0.5 text-xs md:text-sm font-medium"
									>Qty {item?.qty ?? 0}</span
								>
								<span
									class="bg-primary/10 border-primary rounded-full border px-2 py-0.5 text-xs md:text-sm font-medium"
									>Rp {(item?.total ?? 0).toLocaleString('id-ID')}</span
								>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground text-center mt-2">
					Tidak ada data penjualan item.
				</p>
			{/if}
		</Card.Header>
	</Card.Root>
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full;
	}
</style>
