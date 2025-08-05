<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';

	const items = [
		{
			title: 'Total Revenue',
			value: 'Rp1,250.00',
			change: '+12.5%',
			trend: 'Trending up this month',
			note: 'Visitors for the last 6 months'
		},
		{
			title: 'New Customers',
			value: '1,234',
			change: '-20%',
			trend: 'Down 20% this period',
			note: 'Acquisition needs attention'
		},
		{
			title: 'Active Accounts',
			value: '45,678',
			change: '+12.5%',
			trend: 'Strong user retention',
			note: 'Engagement exceed targets'
		},
		{
			title: 'Total Issued',
			value: '4.5%',
			change: '+4.5%',
			trend: 'Steady performance increase',
			note: 'Meets growth projections'
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
				<Card.Action>
					<Badge variant="outline">
						<Icon icon="iconamoon:trend-up-light" />
						{item.change}
					</Badge>
				</Card.Action>
			</Card.Header>
			<Card.Footer class="flex-col items-start gap-1.5 text-sm">
				<div class="line-clamp-1 flex gap-2 font-medium">
					{item.trend}
					<!-- <Icon icon="iconamoon:trend-down-light" /> -->
					<Icon icon="iconamoon:trend-up-light" class="text-lg" />
				</div>
				<div class="text-muted-foreground">{item.note}</div>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>

<style>
	@reference '$appCss';
	.highlight-card {
		@apply *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4;
	}
</style>
