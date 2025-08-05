<script lang="ts">
	import { MOSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { MCoverageDate } from './_components/international/_components/coverage-date';
	import { MSelectCountries } from './_components/international/_components/m-select-countries';
	import { MSelectGroupType } from './_components/select-group-type';
	import { MSelectPaxInsurance } from './_components/select-pax';
	import { MSelectTripInsurance } from './_components/select-trip/index.js';
	import { DomesticCardInfo } from './_components/domestic';

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
		<MSelectTripInsurance bind:value={searchModel.tripMode} />
	</div>
	<Tabs.Root bind:value={searchModel.coverageArea}>
		<Tabs.List class="h-8 rounded-full">
			<Tabs.Trigger
				class="data-[state=active]:text-primary rounded-full font-bold"
				value="international"
			>
				International
			</Tabs.Trigger>
			<Tabs.Trigger
				class="data-[state=active]:text-primary rounded-full font-bold"
				value="domestic"
			>
				Domestic
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</div>

{#if searchModel.coverageArea === 'domestic'}
	<DomesticCardInfo triggerClass />
{:else}
	<MSelectCountries bind:route={routeCountry} isInvalidRoute={validation.isInvalidRoute} />
{/if}

<MCoverageDate bind:dateRange={searchModel.coverageDate} />

<div class="rounded border px-2">
	<MSelectGroupType showIcon={true} bind:value={searchModel.groupType} />
	<Separator class="flex-1" />
	<MSelectPaxInsurance adult={searchModel.adult} child={searchModel.child} />
</div>
