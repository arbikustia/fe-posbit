<script lang="ts">
	import { MOSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import * as Card from '$lib/components/ui/card';
	import { slide } from 'svelte/transition';
	import { MFlightType } from '../flight-type';
	import { MPaxNumber } from '../pax-number';
	import { MPreferredProviders } from '../preferred-providers';
	import MSearchFormMultiCity from './m-search-form-multi-city.svelte';
	import MSearchFormOneWayRoundtrip from './m-search-form-one-way-roundtrip.svelte';
	import { useSearchForm } from './search-form.svelte.js';
	import { Button } from '$lib/components/ui/button';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Icon from '@iconify/svelte';
	import type { Route } from '$lib/types/SearchFlightParam';
	import MSearchFormValidationAlert from './m-search-form-validation-alert.svelte';
	import type { SearchFormProps } from './types';

	let { isLoading, onSubmitCallback }: SearchFormProps = $props();

	const { state, submitSearch, addFlight, removeFlight } = useSearchForm();
</script>

{#snippet submitButton()}
	<Button
		class="mt-5! w-full flex-none text-lg"
		disabled={state.isSubmitted || isLoading}
		onclick={() => submitSearch(onSubmitCallback)}
	>
		{#if state.isSubmitted || isLoading}
			<LoaderCircle class="animate-spin" />
		{:else}
			<Icon icon="bx:search-alt" width="24" height="24" /> <span class="ml-1">Search</span>
		{/if}
	</Button>
{/snippet}

<div class="space-y-2">
	<MSearchFormValidationAlert
		show={state.validation.isInvalidCompany}
		title="Please select a company"
	/>
	<MOSGSelectCompany bind:value={state.searchModel.companyCode} />
	<MFlightType bind:value={state.searchModel.flightType} />
	{#if state.searchModel.flightType != 'multicity'}
		<div transition:slide>
			<MSearchFormOneWayRoundtrip
				bind:route={state.searchModel.route as Route}
				bind:flightType={state.searchModel.flightType}
				isInvalidRoute={state.validation.isInvalidRoute}
			/>
		</div>
	{:else}
		<div class="space-y-2" transition:slide>
			<MSearchFormMultiCity
				routes={state.searchModel.multicityRoutes as Route[]}
				invalidRoutes={state.validation.invalidRoutes}
				{removeFlight}
			/>
			{#if (state.searchModel.multicityRoutes?.length ?? 0) < 5}
				<!-- ADD FLIGHT BUTTON -->
				<Button class="w-full" variant="secondary" onclick={addFlight}>
					<Icon icon="material-symbols:add-rounded" width="24" height="24" />
					<span class="ml-1">Add Flight</span>
				</Button>
			{/if}
		</div>
	{/if}
	<MPreferredProviders bind:value={state.searchModel.preferredProviders} />
	<MPaxNumber
		bind:adult={state.searchModel.adult}
		bind:child={state.searchModel.child}
		bind:infant={state.searchModel.infant}
	/>
	<!-- SEARCH BUTTON -->
	{@render submitButton()}
</div>
