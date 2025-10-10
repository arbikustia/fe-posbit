<script lang="ts">
	import { HighlightCard } from './_components/highlight-card';
	import { ChartVisitors } from './_components/chart-visitors';
	import { BookersTable } from './_components/bookers-table';
</script>

<svelte:head>
	<title>Dashboard | Bantuit</title>
</svelte:head>

<div class="container flex flex-1 flex-col">
	<div class="@container/main flex flex-1 flex-col gap-2">
		<div class="flex flex-col gap-4 md:gap-6">
			<HighlightCard />
			<ChartVisitors />
		</div>
	</div>
</div>
