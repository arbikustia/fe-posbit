<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Area, AreaChart } from 'layerchart';
	import { curveCardinal } from 'd3-shape';
	import dayjs from 'dayjs';
	const { state } = $props();

	// Data pemasukan per hari
	const chartData = $derived(
		state.chart?.labels?.map((label: string, i: number) => ({
			date: new Date(label),
			total: state.chart.values[i]
		})) ?? []
	);

	$effect(() => {
		console.log(chartData, 'chartData');
	});

	// Chart config
	const chartConfig = {
		total: { label: 'Total Pemasukan', color: '#3b82f6' }
	} satisfies Chart.ChartConfig;

	const formatCurrencyID = (value: number) => {
    const actualValue = value;

    // Pembulatan untuk nilai 900.000 ke atas menjadi 1Jt
    if (actualValue >= 900000) {
        return `1Jt`;
    } else if (actualValue >= 1000000) {
        return `${(actualValue / 1000000).toFixed(0)}Jt`;
    } else if (actualValue >= 1000) {
        return `${(actualValue / 1000).toFixed(0)}rb`;
    } else {
        return `Rp ${actualValue.toLocaleString('id-ID')}`;
    }
};

	// Format untuk tooltip (tampilkan nilai penuh)
// Format untuk tooltip (tampilkan nilai penuh)
const formatTooltip = (value: number) => {
    return `Rp ${value.toLocaleString('id-ID')}`;
};
</script>

<div class="w-full space-y-6">
	<Card.Root class="@container/card">
		<Card.Header>
			<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
				<div>
					<Card.Title class="text-xl">Total Penjualan</Card.Title>
					<Card.Description class="mt-1">Memantau Total Penjualan setiap hari</Card.Description>
				</div>
			</div>
		</Card.Header>

		<Card.Content class="pt-4 sm:px-10 sm:pt-6 md:pl-20">
			<Chart.Container config={chartConfig} class="aspect-auto h-[300px] w-full">
				<AreaChart
					legend={false}
					data={chartData}
					x="date"
					series={[{ key: 'total', label: 'Total Pemasukan' }]}
					props={{
						area: {
							curve: curveCardinal.tension(0.3),
							'fill-opacity': 0.6,
							line: { class: 'stroke-2' },
							motion: 'tween'
						},
						xAxis: {
							ticks: chartData.length,
							format: (v) =>
								v ? v.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
						},
						yAxis: {
							label: 'Total Pemasukan',
							format: formatCurrencyID,
							ticks: 5
						}
					}}
				>
					{#snippet marks({ series, getAreaProps })}
						<defs>
							<linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#3b82f6" stop-opacity={1} />
								<stop offset="50%" stop-color="#3b82f6" stop-opacity={0.6} />
								<stop offset="100%" stop-color="#3b82f6" stop-opacity={0.1} />
							</linearGradient>
						</defs>
						{#each series as s, i (s.key)}
							<Area {...getAreaProps(s, i)} fill="url(#fillTotal)" stroke="none" />
						{/each}
					{/snippet}

					{#snippet tooltip()}
						<Chart.Tooltip
							labelFormatter={(v: Date) =>
								v.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
							indicator="line"
						>
							{#snippet formatter({ value })}
								<div class="">
									<div class="text-gray-500">Total Penjualan</div>
									<div class="text-md">{formatTooltip(value as any)}</div>
								</div>
							{/snippet}
						</Chart.Tooltip>
					{/snippet}
				</AreaChart>
			</Chart.Container>
		</Card.Content>
	</Card.Root>
</div>
