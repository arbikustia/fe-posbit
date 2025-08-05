<script lang="ts">
	import * as Chart from '$lib/components/ui/chart/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as ToggleGroup from '$lib/components/ui/toggle-group/index.js';
	//   import { scaleUtc } from "d3-scale";
	import { Area, AreaChart } from 'layerchart';
	//   import { curveNatural } from "d3-shape";
	const chartData = [
		{ date: new Date('2024-04-01'), flight: 222, hotel: 150, train: 30, insurance: 100 },
		{ date: new Date('2024-04-02'), flight: 97, hotel: 180, train: 45, insurance: 80 },
		{ date: new Date('2024-04-03'), flight: 167, hotel: 120, train: 28, insurance: 95 },
		{ date: new Date('2024-04-04'), flight: 242, hotel: 260, train: 50, insurance: 120 },
		{ date: new Date('2024-04-05'), flight: 373, hotel: 290, train: 60, insurance: 130 },
		{ date: new Date('2024-04-06'), flight: 301, hotel: 340, train: 55, insurance: 125 },
		{ date: new Date('2024-04-07'), flight: 245, hotel: 180, train: 40, insurance: 90 },
		{ date: new Date('2024-04-08'), flight: 409, hotel: 320, train: 70, insurance: 140 },
		// { date: new Date('2024-04-09'), flight: 59, hotel: 110, train: 20, insurance: 60 },
		// { date: new Date('2024-04-10'), flight: 261, hotel: 190, train: 42, insurance: 100 },
		// { date: new Date('2024-04-11'), flight: 327, hotel: 350, train: 63, insurance: 135 },
		// { date: new Date('2024-04-12'), flight: 292, hotel: 210, train: 38, insurance: 105 },
		// { date: new Date('2024-04-13'), flight: 342, hotel: 380, train: 70, insurance: 145 },
		// { date: new Date('2024-04-14'), flight: 137, hotel: 220, train: 36, insurance: 85 },
		// { date: new Date('2024-04-15'), flight: 120, hotel: 170, train: 25, insurance: 75 },
		// { date: new Date('2024-04-16'), flight: 138, hotel: 190, train: 30, insurance: 88 },
		// { date: new Date('2024-04-17'), flight: 446, hotel: 360, train: 75, insurance: 150 }
	];

	let timeRange = $state('90d');
	const selectedLabel = $derived.by(() => {
		switch (timeRange) {
			case '90d':
				return 'Last 3 months';
			case '30d':
				return 'Last 30 days';
			case '7d':
				return 'Last 7 days';
			default:
				return 'Last 3 months';
		}
	});
	const filteredData = $derived(
		chartData.filter((item) => {
			const referenceDate = new Date('2024-06-30');
			let daysToSubtract = 90;
			if (timeRange === '30d') {
				daysToSubtract = 30;
			} else if (timeRange === '7d') {
				daysToSubtract = 7;
			}
			referenceDate.setDate(referenceDate.getDate() - daysToSubtract);
			return item.date >= referenceDate;
		})
	);

	const chartConfig = {
		flight: { label: 'Flight', color: 'var(--primary)' },
		hotel: { label: 'Hotel', color: 'var(--primary)' },
		train: { label: 'Train', color: 'var(--primary)' },
		insurance: { label: 'Insurance', color: 'var(--primary)' }
	} satisfies Chart.ChartConfig;

	const timeList = [
		{ key: '90d', title: 'Last 3 months' },
		{ key: '30d', title: 'Last 30 days' },
		{ key: '7d', title: 'Last 7 days' }
	];
</script>

<Card.Root class="@container/card">
	<Card.Header>
		<Card.Title>Total Visitors</Card.Title>
		<Card.Description>
			<span class="hidden @[540px]/card:block"> Total for the {selectedLabel} </span>
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
			<!-- xScale={scaleUtc()} -->
			<AreaChart
				legend
				data={filteredData}
				x="date"
				series={[
					{
						key: 'flight',
						label: 'Flight',
						color: chartConfig.flight.color
					},
					{
						key: 'hotel',
						label: 'Hotel',
						color: chartConfig.hotel.color
					},
					{
						key: 'train',
						label: 'Train',
						color: chartConfig.train.color
					},
					{
						key: 'insurance',
						label: 'Insurance',
						color: chartConfig.insurance.color
					}
				]}
				seriesLayout="stack"
				props={{
					area: {
						// curve: curveNatural,
						'fill-opacity': 0.4,
						line: { class: 'stroke-1' },
						motion: 'tween'
					},
					xAxis: {
						ticks: timeRange === '7d' ? 7 : undefined,
						format: (v) => {
							if (!v) return;
							return v.toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric'
							});
						}
					},
					yAxis: { format: () => '' }
				}}
			>
				{#snippet marks({ series, getAreaProps })}
					<defs>
						<linearGradient id="fillFlight" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-flight)" stop-opacity={1.0} />
							<stop offset="95%" stop-color="var(--color-flight)" stop-opacity={0.1} />
						</linearGradient>
						<linearGradient id="fillHotel" x1="0" y1="0" x2="0" y2="1">
							<stop offset="5%" stop-color="var(--color-hotel)" stop-opacity={0.8} />
							<stop offset="95%" stop-color="var(--color-hotel)" stop-opacity={0.1} />
						</linearGradient>
					</defs>
					{#each series as s, i (s.key)}
						<Area
							{...getAreaProps(s, i)}
							fill={s.key === 'flight' ? 'url(#fillFlight)' : 'url(#fillHotel)'}
						/>
					{/each}
				{/snippet}
				{#snippet tooltip()}
					<Chart.Tooltip
						labelFormatter={(v: Date) => {
							return v.toLocaleDateString('en-US', {
								month: 'short',
								day: 'numeric'
							});
						}}
						indicator="line"
					/>
				{/snippet}
			</AreaChart>
		</Chart.Container>
	</Card.Content>
</Card.Root>
