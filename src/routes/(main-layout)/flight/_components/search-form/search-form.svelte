<script lang="ts">
	import { OSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import { FlightType } from '../flight-type';
	import { PaxNumber } from '../pax-number';
	import { PreferredProviders } from '../preferred-providers';
	import SearchFormMultiCity from './search-form-multi-city.svelte';
	import SearchFormOneWayRoundtrip from './search-form-one-way-roundtrip.svelte';
	import { useSearchForm } from './search-form.svelte.js';
	import SearchFormValidationAlert from './search-form-validation-alert.svelte';
	import Icon from '@iconify/svelte';
	import type { Route, SearchFlightParam } from '$lib/types/SearchFlightParam';
	import { cn } from '$lib/utils';
	import type { SearchFormProps } from './types';
	import SearchFormMultiCityDialog from './search-form-multi-city-dialog.svelte';

	let {
		isLoading,
		onSubmitCallback,
		variant = 'default'
	}: SearchFormProps & { variant?: 'default' | 'sticky' } = $props();

	const { state, submitSearch, addFlight, removeFlight } = useSearchForm();
</script>

{#snippet searchButton(flightType?: SearchFlightParam['flightType'])}
	<Button
		class={cn('h-auto w-[120px] flex-none text-lg', {
			'ml-auto': flightType === 'multicity',
			'min-h-11': flightType === 'multicity' && variant === 'default'
		})}
		size="lg"
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

{#if variant === 'sticky'}
	<div class="bg-card z-1 sticky top-0 border-y shadow-sm">
		<div class="mx-auto max-w-6xl px-4 py-2">
			<div class="mb-2 flex items-center gap-x-2">
				<div>
					<FlightType
						bind:value={state.searchModel.flightType}
						type="select"
						triggerClass="h-fit! text-xs p-1!"
					/>
				</div>
				<div class="relative">
					<OSGSelectCompany
						bind:value={state.searchModel.companyCode}
						triggerClass="h-fit! text-xs p-1!"
						showIcon={false}
						showSelectedCode={false}
					></OSGSelectCompany>
					<SearchFormValidationAlert show={state.validation.isInvalidCompany}>
						Please select a company
					</SearchFormValidationAlert>
				</div>
				<div>
					<PaxNumber
						bind:adult={state.searchModel.adult}
						bind:child={state.searchModel.child}
						bind:infant={state.searchModel.infant}
						triggerClass="h-fit! text-xs p-1!"
						showIcon={false}
					></PaxNumber>
				</div>
				<div>
					<PreferredProviders
						bind:value={state.searchModel.preferredProviders}
						triggerClass="h-fit! text-xs p-1!"
						showIcon={false}
					/>
				</div>
			</div>
			{#if state.searchModel.flightType != 'multicity'}
				<div class="flex gap-5">
					<div class="flex-1">
						<SearchFormOneWayRoundtrip
							bind:route={state.searchModel.route as Route}
							bind:flightType={state.searchModel.flightType}
							isInvalidRoute={state.validation.isInvalidRoute}
							airportSelectWrapperClass="p-0 bg-gray-50"
							dateSelectWrapperClass="p-0 bg-gray-50"
						/>
					</div>
					<!-- SEARCH BUTTON -->
					{@render searchButton()}
				</div>
			{:else}
				<div class="flex justify-end gap-x-4">
					<SearchFormMultiCityDialog
						bind:routes={state.searchModel.multicityRoutes as Route[]}
						invalidRoutes={state.validation.invalidRoutes}
						{removeFlight}
					/>

					<!-- SEARCH BUTTON -->
					{@render searchButton('multicity')}
				</div>
			{/if}
		</div>
	</div>
{:else}
	<Card.Root>
		<Card.Content>
			<div>
				<div class="mb-4 flex items-center justify-end space-x-3">
					<div class="mr-auto flex items-center gap-4">
						<FlightType bind:value={state.searchModel.flightType} />
						<div class="relative">
							<OSGSelectCompany bind:value={state.searchModel.companyCode}></OSGSelectCompany>
							<SearchFormValidationAlert show={state.validation.isInvalidCompany}>
								Please select a company
							</SearchFormValidationAlert>
						</div>
					</div>

					<div>
						<PaxNumber
							bind:adult={state.searchModel.adult}
							bind:child={state.searchModel.child}
							bind:infant={state.searchModel.infant}
						></PaxNumber>
					</div>
					<div>
						<PreferredProviders bind:value={state.searchModel.preferredProviders} />
					</div>
				</div>

				{#if state.searchModel.flightType != 'multicity'}
					<div class="mt-10 flex gap-5">
						<div class="flex-1">
							<SearchFormOneWayRoundtrip
								bind:route={state.searchModel.route as Route}
								bind:flightType={state.searchModel.flightType}
								isInvalidRoute={state.validation.isInvalidRoute}
								showLabel
							/>
						</div>
						<!-- SEARCH BUTTON -->
						{@render searchButton()}
					</div>
				{:else}
					<SearchFormMultiCity
						bind:routes={state.searchModel.multicityRoutes as Route[]}
						invalidRoutes={state.validation.invalidRoutes}
						{removeFlight}
					/>
					<div class="flex">
						{#if (state.searchModel.multicityRoutes?.length ?? 0) < 5}
							<!-- ADD FLIGHT BUTTON -->
							<Button variant="secondary" size="lg" onclick={addFlight}>
								<Icon icon="material-symbols:add-rounded" width="24" height="24" />
								<span class="ml-1">Add Flight</span>
							</Button>
						{/if}

						<!-- SEARCH BUTTON -->
						{@render searchButton('multicity')}
					</div>
				{/if}
			</div>
		</Card.Content>
	</Card.Root>
{/if}
