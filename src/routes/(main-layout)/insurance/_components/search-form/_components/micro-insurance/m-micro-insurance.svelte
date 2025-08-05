<script lang="ts">
	import { MOSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { MCoverageDate } from '../travel-insurance/_components/international/_components/coverage-date';

	let { searchModel = $bindable(), validation } = $props();

	let routeCountry = $state({
		originCountry: searchModel.originCountry,
		destinationCountry: searchModel.destinationCountry
	});

	$effect(() => {
		searchModel.originCountry = routeCountry.originCountry;
		searchModel.destinationCountry = routeCountry.destinationCountry;
	});
</script>

<div class="flex flex-col gap-1 space-y-2">
	<div class="flex gap-3">
		<MOSGSelectCompany
			bind:value={searchModel.companyCode}
			triggerClass="bg-transparent text-primary w-max"
		/>
	</div>
	<Tabs.Root bind:value={searchModel.coverageperiod}>
		<Tabs.List class="h-8 rounded-full">
			<Tabs.Trigger
				class="data-[state=active]:text-primary rounded-full font-bold"
				value="6-months"
			>
				6 Months
			</Tabs.Trigger>
			<Tabs.Trigger class="data-[state=active]:text-primary rounded-full font-bold" value="annual">
				Annual
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</div>

<MCoverageDate
	bind:dateRange={searchModel.coverageDate}
	startLabel="Coverage Start Date"
	endLabel="Coverage End Date"
/>
