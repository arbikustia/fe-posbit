<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import { Area, AreaChart } from 'layerchart';

	// 📊 Data pembelian emas di toko
	const chartData = [
		{ date: new Date('2024-04-01'), emasPerhiasan: 120, emasBatangan: 90, perak: 30, pembelianKembali: 20 },
		{ date: new Date('2024-04-02'), emasPerhiasan: 180, emasBatangan: 110, perak: 45, pembelianKembali: 35 },
		{ date: new Date('2024-04-03'), emasPerhiasan: 150, emasBatangan: 95, perak: 40, pembelianKembali: 25 },
		{ date: new Date('2024-04-04'), emasPerhiasan: 200, emasBatangan: 140, perak: 55, pembelianKembali: 40 },
		{ date: new Date('2024-04-05'), emasPerhiasan: 260, emasBatangan: 170, perak: 60, pembelianKembali: 50 },
		{ date: new Date('2024-04-06'), emasPerhiasan: 300, emasBatangan: 190, perak: 70, pembelianKembali: 65 },
		{ date: new Date('2024-04-07'), emasPerhiasan: 230, emasBatangan: 160, perak: 50, pembelianKembali: 45 },
		{ date: new Date('2024-04-08'), emasPerhiasan: 340, emasBatangan: 220, perak: 75, pembelianKembali: 60 }
	];

	let timeRange = $state('90d');
	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
			case '90d':
				return '3 bulan terakhir';
			case '30d':
				return '30 hari terakhir';
			case '7d':
				return '7 hari terakhir';
			default:
				return '3 bulan terakhir';
		}
	});

	const filteredData = $derived(
		chartData.filter((item) => {
			const referenceDate = new Date('2024-06-30');
			let daysToSubtract = 90;
			if (timeRange === '30d') daysToSubtract = 30;
			else if (timeRange === '7d') daysToSubtract = 7;
			referenceDate.setDate(referenceDate.getDate() - daysToSubtract);
			return item.date >= referenceDate;
		})
	);

	// 🎨 Konfigurasi chart
	const chartConfig = {
		emasPerhiasan: { label: 'Emas Perhiasan', color: '#f72' }, // kuning keemasan
		emasBatangan: { label: 'Emas Batangan', color: '#eab308' },
		perak: { label: 'Perak', color: '#9ca3af' },
		pembelianKembali: { label: 'Pembelian Kembali', color: '#22c55e' }
	} satisfies Chart.ChartConfig;

	const timeList = [
		{ key: '90d', title: '3 Bulan' },
		{ key: '30d', title: '30 Hari' },
		{ key: '7d', title: '7 Hari' }
	];
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>Data Pembelian Emas</Card.Title>
		<Card.Description>
			<span class="hidden @[540px]/card:block">Total transaksi untuk {selectedLabel}</span>
			<span class="@[540px]/card:hidden">{selectedLabel}</span>
		</Card.Description>
		<Card.Action>
			<ToggleGroup.Root
				type="single"
				bind:value={timeRange}
				variant="outline"
				class="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
			>
				{#each timeList as n}
					<ToggleGroup.Item value={n.key}>{n.title}</ToggleGroup.Item>
				{/each}
			</ToggleGroup.Root>
		</Card.Action>
	</Card.Header>

	<Card.Content class="px-2 pt-4 sm:px-6 sm:pt-6">
		<Chart.Container config={chartConfig} class="aspect-auto h-[250px] w-full">
			<AreaChart
				legend
				data={filteredData}
				x="date"
				series={[
					{ key: 'emasPerhiasan', label: 'Emas Perhiasan', color: chartConfig.emasPerhiasan.color },
					{ key: 'emasBatangan', label: 'Emas Batangan', color: chartConfig.emasBatangan.color },
					{ key: 'perak', label: 'Perak', color: chartConfig.perak.color },
					{ key: 'pembelianKembali', label: 'Pembelian Kembali', color: chartConfig.pembelianKembali.color }
				]}
				seriesLayout="stack"
				props={{
					area: { 'fill-opacity': 0.4, line: { class: 'stroke-1' }, motion: 'tween' },
					xAxis: {
						ticks: timeRange === '7d' ? 7 : undefined,
						format: (v) =>
							v?.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
					},
					yAxis: { format: (v) => `${v}x` }
				}}
			>
				{#snippet marks({ series, getAreaProps })}
					{#each series as s, i (s.key)}
						<Area {...getAreaProps(s, i)} fill={s.color} />
					{/each}
				{/snippet}

				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) =>
							v.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
						}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
