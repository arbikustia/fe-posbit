<script lang="ts">
	import { HighlightCard } from './_components/highlight-card';
	import { ChartVisitors } from './_components/chart-visitors';
	import { useDashboardPage } from '../dashboard/_components/use-dashboard-page.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { HighlightGudang } from './_components/highlight-gudang';
	import { useDashboardInventory } from './_components/highlight-gudang/use-highlight-gudang.svelte';
	import { getUserRole } from '@/rbacUtils';
	import { page } from '$app/state';

	const role = getUserRole()?.toLocaleLowerCase();
	$: tabs = page.url.searchParams.get('tabs');
	const { state: pageState, handleGetSummary, handleGetChart } = useDashboardPage();
	const { state: inventoryState } = useDashboardInventory();
</script>

<svelte:head>
	<title>Dashboard | Bantuit</title>
</svelte:head>

<Tabs.Root value={tabs ? tabs : role == 'admin' ? 'gudang' : 'toko'} class="container">
	<Tabs.List>
		{#if role == 'superadmin'}
			<Tabs.Trigger value="toko">Toko</Tabs.Trigger>
			<Tabs.Trigger value="gudang">Gudang</Tabs.Trigger>
		{:else if role == 'admin'}
			<Tabs.Trigger value="gudang">Gudang</Tabs.Trigger>
		{/if}
	</Tabs.List>
	<Tabs.Content value="toko">
		<div class="flex w-full flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-4">
				<!-- 🔹 Konten utama -->
				<div class="flex flex-col gap-4 md:gap-6">
					<HighlightCard state={pageState} inventoryState={inventoryState} {handleGetSummary} {handleGetChart} />
					<ChartVisitors state={pageState} />
				</div>
			</div>
		</div>
	</Tabs.Content>
	<Tabs.Content value="gudang">
		<div class="flex w-full flex-1 flex-col">
			<div class="@container/main flex flex-1 flex-col gap-4">
				<!-- 🔹 Konten utama -->
				<div class="flex flex-col gap-4 md:gap-6">
					<HighlightGudang state={inventoryState} />
				</div>
			</div>
		</div>
	</Tabs.Content>
</Tabs.Root>
