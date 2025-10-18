<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Area, AreaChart } from 'layerchart';
	import { curveCardinal } from 'd3-shape';

	// Extended chart data with more dates for better filtering demonstration
	const chartData = [
		{ date: new Date('2024-01-01'), flight: 222, hotel: 150, train: 30, insurance: 100 },
		{ date: new Date('2024-01-15'), flight: 197, hotel: 180, train: 45, insurance: 80 },
		{ date: new Date('2024-02-01'), flight: 167, hotel: 120, train: 28, insurance: 95 },
		{ date: new Date('2024-02-15'), flight: 242, hotel: 260, train: 50, insurance: 120 },
		{ date: new Date('2024-03-01'), flight: 373, hotel: 290, train: 60, insurance: 130 },
		{ date: new Date('2024-03-15'), flight: 301, hotel: 340, train: 55, insurance: 125 },
		{ date: new Date('2024-04-01'), flight: 245, hotel: 180, train: 40, insurance: 90 },
		{ date: new Date('2024-04-02'), flight: 409, hotel: 320, train: 70, insurance: 140 },
		{ date: new Date('2024-04-03'), flight: 259, hotel: 210, train: 35, insurance: 85 },
		{ date: new Date('2024-04-04'), flight: 321, hotel: 280, train: 48, insurance: 110 },
		{ date: new Date('2024-04-05'), flight: 187, hotel: 190, train: 32, insurance: 95 },
		{ date: new Date('2024-04-06'), flight: 298, hotel: 250, train: 42, insurance: 105 },
		{ date: new Date('2024-04-07'), flight: 356, hotel: 310, train: 58, insurance: 125 },
		{ date: new Date('2024-04-08'), flight: 223, hotel: 170, train: 38, insurance: 88 }
	];

	// State for selected time range
	let timeRange = $state('7d');

	// Derived label for selected time range
	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
			case '7d':
				return ' 7 hari terakhir';
			case '30d':
				return ' 30 hari terakhir';
			case '90d':
				return ' 3 hari terakhir';
			default:
				return ' 7 hari terakhir';
		}
	});

	// Filtered data based on selected time range
	const filteredData = $derived.by(() => {
		const now = new Date('2024-04-08'); // Using last date as reference
		let daysToSubtract = 7;

		switch (timeRange) {
			case '7h':
				daysToSubtract = 7;
				break;
			case '30h':
				daysToSubtract = 30;
				break;
			case '90h':
				daysToSubtract = 90;
				break;
		}

		const startDate = new Date(now);
		startDate.setDate(startDate.getDate() - daysToSubtract);

		return chartData.filter((item) => item.date >= startDate && item.date <= now);
	});

	// Chart configuration with distinct colors
	const chartConfig = {
		flight: { label: 'baju', color: '#3b82f6' }, // Blue
		hotel: { label: 'celana', color: '#10b981' }, // Emerald
		train: { label: 'jaket', color: '#f59e0b' }, // Amber
		insurance: { label: 'sepatu', color: '#ef4444' } // Red
	} satisfies Chart.ChartConfig;

	// Time range options
	const timeList = [
		{ key: '7h', title: ' 7 hari terakhir' },
		{ key: '30h', title: ' 30 hari terakhir' },
		{ key: '90h', title: ' 3 hari terakhir' }
	];

	// Calculate total values for summary
	const totalValues = $derived.by(() => {
		const totals = filteredData.reduce(
			(acc, item) => ({
				flight: acc.flight + item.flight,
				hotel: acc.hotel + item.hotel,
				train: acc.train + item.train,
				insurance: acc.insurance + item.insurance
			}),
			{ flight: 0, hotel: 0, train: 0, insurance: 0 }
		);
		return totals;
	});

	const grandTotal = $derived(
		totalValues.flight + totalValues.hotel + totalValues.train + totalValues.insurance
	);
</script>

<div class="w-full space-y-6">
	<!-- Summary Cards -->

	<!-- Main Chart Card -->
	<Card.Root class="@container/card">
		<Card.Header>
			<div
				class="flex flex-col space-y-1.5 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
			>
				<div>
					<Card.Title class="text-xl">Data Penjualan</Card.Title>
					<Card.Description class="mt-1">
						<span class="hidden @[540px]/card:block">
							Total pengeluaran selama {selectedLabel.toLowerCase()}
						</span>
						<span class="@[540px]/card:hidden">
							{selectedLabel}: IDR {grandTotal.toLocaleString()}
						</span>
					</Card.Description>
				</div>

				<!-- Desktop Toggle Group -->
				<ToggleGroup.Root
					type="single"
					bind:value={timeRange}
					variant="outline"
					class="hidden @[767px]/card:flex"
				>
					{#each timeList as item}
						<ToggleGroup.Item value={item.key} class="px-3 py-1.5 text-sm">
							{item.title}
						</ToggleGroup.Item>
					{/each}
				</ToggleGroup.Root>

				<!-- Mobile Select -->
				<div class="@[767px]/card:hidden">
					<Select.Root bind:selected={timeRange}>
						<Select.Trigger class="w-[180px]">
							<Select.Value placeholder="Select time range" />
						</Select.Trigger>
						<Select.Content>
							{#each timeList as item}
								<Select.Item value={item.key}>{item.title}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
			</div>
		</Card.Header>

		<Card.Content class="px-2 pt-4 sm:px-6 sm:pt-6">
			<Chart.Container config={chartConfig} class="aspect-auto h-[300px] w-full">
				<AreaChart
					legend
					data={filteredData}
					x="date"
					series={[
						{
							key: 'flight',
							label: 'Baju',
							color: chartConfig.flight.color
						},
						{
							key: 'hotel',
							label: 'Celana',
							color: chartConfig.hotel.color
						},
						{
							key: 'train',
							label: 'Jaket',
							color: chartConfig.train.color
						},
						{
							key: 'insurance',
							label: 'Sepatu',
							color: chartConfig.insurance.color
						}
					]}
					seriesLayout="stack"
					props={{
						area: {
							curve: curveCardinal.tension(0.3),
							'fill-opacity': 0.6,
							line: { class: 'stroke-2' },
							motion: 'tween'
						},
						xAxis: {
							ticks: timeRange === '7d' ? 7 : timeRange === '30d' ? 6 : 8,
							format: (v) => {
								if (!v) return '';
								return v.toLocaleDateString('en-US', {
									month: 'short',
									day: 'numeric'
								});
							}
						},
						yAxis: {
							label: 'Jumlah Penjualan', // 🟢 Tambahkan label vertikal di kiri sini
							format: (v) => v, // tampilkan nilai numerik di axis
							ticks: 5
						}
					}}
				>
					{#snippet marks({ series, getAreaProps })}
						<defs>
							<!-- Fill Gradients -->
							<linearGradient id="fillFlight" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#3b82f6" stop-opacity={1.0} />
								<stop offset="50%" stop-color="#3b82f6" stop-opacity={0.6} />
								<stop offset="100%" stop-color="#3b82f6" stop-opacity={0.1} />
							</linearGradient>
							<linearGradient id="fillHotel" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#10b981" stop-opacity={1.0} />
								<stop offset="50%" stop-color="#10b981" stop-opacity={0.6} />
								<stop offset="100%" stop-color="#10b981" stop-opacity={0.1} />
							</linearGradient>
							<linearGradient id="fillTrain" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#f59e0b" stop-opacity={1.0} />
								<stop offset="50%" stop-color="#f59e0b" stop-opacity={0.6} />
								<stop offset="100%" stop-color="#f59e0b" stop-opacity={0.1} />
							</linearGradient>
							<linearGradient id="fillInsurance" x1="0" y1="0" x2="0" y2="1">
								<stop offset="0%" stop-color="#ef4444" stop-opacity={1.0} />
								<stop offset="50%" stop-color="#ef4444" stop-opacity={0.6} />
								<stop offset="100%" stop-color="#ef4444" stop-opacity={0.1} />
							</linearGradient>
						</defs>
						{#each series as s, i (s.key)}
							<Area
								{...getAreaProps(s, i)}
								fill={`url(#fill${s.key.charAt(0).toUpperCase() + s.key.slice(1)})`}
								stroke="none"
							/>
						{/each}
					{/snippet}
					{#snippet tooltip()}
						<Chart.Tooltip
							labelFormatter={(v: Date) => {
								return v.toLocaleDateString('en-US', {
									weekday: 'short',
									month: 'short',
									day: 'numeric'
								});
							}}
							valueFormatter={(value) => `IDR ${value.toLocaleString()}`}
							indicator="line"
							class="min-w-[160px]"
						/>
					{/snippet}
				</AreaChart>
			</Chart.Container>
		</Card.Content>
	</Card.Root>
</div>
