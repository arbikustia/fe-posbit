<script lang="ts">
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { useSearchForm } from '../../../../search-form.svelte.js';
	import { CoverageDate } from './_components/coverage-date';
	import { SelectCountry } from './_components/select-country/index.js';

	const { variant, triggerClass, state, isEndDate } = $props();
</script>

{#if variant == 'combination'}
	<div class="flex w-full flex-col items-end gap-4">
		<section class="flex w-full flex-col rounded-md border py-2">
			<div class="flex w-full flex-col gap-2 px-2">
				<label class="text-xs text-gray-500" for="Origin">Origin Country</label>
				<SelectCountry
					triggerClass="px-0 py-0 m-0 border-none"
					disabled={true}
					variant="compact"
					showIcon={true}
					bind:value={state.searchModel.originCountry}
				/>
			</div>
			<div class="px-2 py-2">
				<Separator />
			</div>
			<div class="flex w-full flex-col gap-2 px-2">
				<label class=" text-xs text-gray-500" for="Destination">Destination Country</label>
				<SelectCountry
					triggerClass="px-0 py-0 m-0  border-none"
					variant="compact"
					showIcon={true}
					bind:value={state.searchModel.destinationCountry}
				/>
			</div>
		</section>
		<CoverageDate {isEndDate} {variant} bind:dateRange={state.searchModel.coverageDate} />
	</div>
{:else}
	<div class="flex w-full items-end gap-4">
		<SelectCountry
			{triggerClass}
			disabled={true}
			label="Origin Country"
			{variant}
			showIcon={true}
			bind:value={state.searchModel.originCountry}
		/>
		<SelectCountry
			{triggerClass}
			label="Destination Country"
			{variant}
			showIcon={true}
			bind:value={state.searchModel.destinationCountry}
		/>
		<CoverageDate {isEndDate} {variant} bind:dateRange={state.searchModel.coverageDate} />
	</div>
{/if}
