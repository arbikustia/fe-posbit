<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';

	const items = [
		{
			title: 'Total Penjualan Bulan Ini',
			value: 'Rp182.500.000',
			change: '+8.2%',
			trend: 'Penjualan meningkat dari bulan lalu',
			note: 'Kinerja toko emas tetap stabil'
		},
		{
			title: 'Jumlah Transaksi',
			value: '128',
			change: '+5.5%',
			trend: 'Lebih banyak transaksi harian',
			note: 'Rata-rata 4 transaksi per hari'
		},
		{
			title: 'Total Berat Emas Terjual',
			value: '354 gram',
			change: '+12%',
			trend: 'Permintaan tinggi untuk emas 23K',
			note: 'Mayoritas penjualan perhiasan gelang'
		},
		{
			title: 'Pelanggan Baru',
			value: '47',
			change: '+9.3%',
			trend: 'Pertumbuhan pelanggan meningkat',
			note: 'Kampanye promosi berjalan efektif'
		}
	];
</script>

<div class="highlight-card">
	{#each items as item}
		<Card.Root class="@container/card">
			<Card.Header>
				<Card.Description>{item.title}</Card.Description>
				<Card.Title class="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
					{item.value}
				</Card.Title>
				<!-- <Card.Action>
					<Badge variant="outline" class="flex items-center gap-1">
						<Icon
							icon={item.change.startsWith('+')
								? 'iconamoon:trend-up-light'
								: 'iconamoon:trend-down-light'}
							class={item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}
						/>
						{item.change}
					</Badge>
				</Card.Action> -->
			</Card.Header>
			<!-- <Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<div class="line-clamp-1 flex gap-2 font-medium">
					{item.trend}
					<Icon
						icon={item.change.startsWith('+')
							? 'iconamoon:trend-up-light'
							: 'iconamoon:trend-down-light'}
						class={item.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}
					/>
				</div>
				<div class="text-muted-foreground">{item.note}</div>
			</Card.Footer> -->
		</Card.Root>
	{/each}
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs dark:*:data-[slot=card]:bg-card @xl/main:grid-cols-2 @5xl/main:grid-cols-4;
	}
</style>
