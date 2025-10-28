<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';

	// Props diterima dari parent (Dashboard)
	const { state } = $props();
</script>
<div class="highlight-card-modified">
	<!-- Tiga cards pertama -->
	<Card.Root class="@container/card">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<!-- Total Penjualan -->
		</Card.Header>
	</Card.Root>

	<Card.Root class="@container/card">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<!-- Jumlah Transaksi -->
		</Card.Header>
	</Card.Root>

	<Card.Root class="@container/card">
		<Card.Header class="flex flex-col items-center space-y-2 p-4">
			<!-- Jumlah Pelanggan Baru -->
		</Card.Header>
	</Card.Root>

	<!-- Top Items mengambil full width di row kedua -->
	<Card.Root class="@container/card col-span-full">
		<Card.Header class="flex flex-col space-y-3 p-4">
			<div class="flex items-center gap-2">
				<Icon icon="iconoir:bright-star" class="text-2xl text-yellow-500" />
				<Card.Description class="text-sm font-medium">
					Top 5 Penjualan Item
				</Card.Description>
			</div>

			{#if state?.summary?.top_five?.length > 0}
				<div class="grid grid-cols-1 md:grid-cols-5 gap-3 w-full">
					{#each state.summary.top_five.slice(0, 5) as item, index}
						<div class="flex flex-col items-center text-center p-3 rounded-lg border bg-card hover:shadow-md transition-all">
							<div class="w-8 h-8 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold mb-2">
								{index + 1}
							</div>
							<div class="text-sm font-medium mb-1 line-clamp-2 h-10 flex items-center justify-center">
								{item?.name ?? 'Unknown Item'}
							</div>
							<div class="text-xs text-muted-foreground mb-1">
								Qty: {item?.qty ?? 0}
							</div>
							<div class="text-sm font-semibold text-green-600">
								Rp {((item?.total ?? 0) / 1000).toFixed(0)}k
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground text-center py-4">
					Tidak ada data penjualan item.
				</p>
			{/if}
		</Card.Header>
	</Card.Root>
</div>

<style>
	@reference '$appCss';
	.highlight-card-modified {
		@apply grid grid-cols-1 sm:grid-cols-3 gap-4 w-full;
	}
	
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>