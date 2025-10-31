<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';

	// Props diterima dari parent (Dashboard)
	const { state } = $props();
</script>

<div class="highlight-card">
	<!-- Total Penjualan Bulan Ini -->
	<Card.Root class="@container/card h-fit min-h-28 p-0">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:cash-multiple" class="text-2xl text-emerald-500 md:text-2xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Total Penjualan Bulan Ini
				</Card.Description>
			</div>
			<Card.Title class="text-2xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				Rp {state?.summary?.total_sale?.toLocaleString('id-ID') ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Transaksi -->
	<Card.Root class="@container/card h-fit min-h-28 p-0">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:cart-outline" class="text-2xl text-blue-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Jumlah Transaksi
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state?.summary?.total_tTransaction ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Jumlah Pelanggan Baru -->
	<Card.Root class="@container/card h-fit min-h-28 p-0">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-start">
				<Icon icon="mdi:account-plus-outline" class="text-2xl text-amber-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Jumlah Pelanggan Baru
				</Card.Description>
			</div>
			<Card.Title class="text-4xl font-semibold tabular-nums md:text-2xl lg:text-3xl">
				{state?.summary?.new_customer ?? 0}
			</Card.Title>
		</Card.Header>
	</Card.Root>

	<!-- Penjualan Item Terbanyak -->
	<Card.Root class="@container/card col-span-full p-0">
		<Card.Header class="flex flex-col items-center justify-center space-y-2 p-4">
			<div class="flex w-full items-center justify-center gap-2 md:justify-center">
				<Icon icon="iconoir:bright-star" class="text-2xl text-yellow-500 md:text-3xl" />
				<Card.Description class="text-center text-lg md:text-left md:text-sm">
					Penjualan Item Terbanyak
				</Card.Description>
			</div>

			{#if state?.summary?.top_five?.length > 0}
				<div class="grid w-full grid-cols-1 gap-3 overflow-y-auto md:grid-cols-2 lg:grid-cols-5">
					{#each state.summary.top_five.slice(0, 5) as item, index}
						<Tooltip.Provider>
							<Tooltip.Root>
								<Tooltip.Trigger>
									<div class="flex flex-col rounded-lg border p-3 pb-2 shadow">
										<div
											class="truncate text-center text-base font-semibold md:text-left md:text-base"
										>
											{index + 1}. {item?.name ?? 'Unknown Item'}
										</div>
										<div class="mt-1 flex flex-wrap justify-center gap-2 md:justify-start">
											<span
												class="bg-primary/10 border-primary flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium md:text-xs"
												>Qty {item?.qty ?? 0}</span
											>
											<!-- <span
									class="bg-primary/10 border-primary rounded-full border px-2 py-0.5 text-xs md:text-xs font-medium"
									>Rp {(item?.total ?? 0).toLocaleString('id-ID')}</span
								> -->
										</div>
									</div>
								</Tooltip.Trigger>
								<Tooltip.Content>
									<p>{item?.name}</p>
								</Tooltip.Content>
							</Tooltip.Root>
						</Tooltip.Provider>
					{/each}
				</div>
			{:else}
				<p class="text-muted-foreground mt-2 text-center text-sm">Tidak ada data penjualan item.</p>
			{/if}
		</Card.Header>
	</Card.Root>
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3;
	}
</style>
