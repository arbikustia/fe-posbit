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
	import type { Route } from '$lib/types/SearchFlightParam';
	import type { SearchFormProps } from './types';
	import { slide } from 'svelte/transition';

	let { isLoading, onSubmitCallback }: SearchFormProps = $props();

	const { state, submitSearch, addFlight, removeFlight } = useSearchForm();
</script>

<Card.Root>
	<Card.Content>
		<div>
			<div class="mb-4 space-y-2">
				<div class="relative">
					<OSGSelectCompany bind:value={state.searchModel.companyCode} triggerClass="w-full border"
					></OSGSelectCompany>
					<SearchFormValidationAlert show={state.validation.isInvalidCompany}>
						Please select a company
					</SearchFormValidationAlert>
				</div>

				<div class="mb-4">
					<FlightType
						variant="combination"
						bind:value={state.searchModel.flightType}
						class="w-full"
					/>
				</div>

				{#if state.searchModel.flightType != 'multicity'}
					<div class="flex w-full gap-5">
						<div transition:slide class="w-full">
							<SearchFormOneWayRoundtrip
								variant="combination"
								bind:route={state.searchModel.route as Route}
								bind:flightType={state.searchModel.flightType}
								isInvalidRoute={state.validation.isInvalidRoute}
								showLabel
								class="block w-full space-y-10"
							/>
						</div>
					</div>
				{:else}
					<div class="space-y-2" transition:slide>
						<SearchFormMultiCity
							variant="combination"
							bind:routes={state.searchModel.multicityRoutes as Route[]}
							invalidRoutes={state.validation.invalidRoutes}
							{removeFlight}
							class="block space-y-2"
							removeBtnClass="w-full"
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

				<PreferredProviders
					variant="combination"
					triggerClass="flex-1 border"
					bind:value={state.searchModel.preferredProviders}
				/>

				<PaxNumber
					variant="combination"
					bind:adult={state.searchModel.adult}
					bind:child={state.searchModel.child}
					bind:infant={state.searchModel.infant}
					triggerClass="flex-1 border"
				></PaxNumber>
			</div>

			<div class="mt-4 w-full flex flex-wrap gap-2">
				{#if (state.searchModel.multicityRoutes?.length ?? 0) < 5 && state.searchModel.flightType === 'multicity'}
					<!-- ADD FLIGHT BUTTON -->
					<Button variant="secondary" size="lg" onclick={addFlight}>
						<Icon icon="material-symbols:add-rounded" width="24" height="24" />
						<span class="ml-1">Add Flight</span>
					</Button>
				{/if}
				<Button
					class="ml-auto h-10 w-full text-lg"
					disabled={state.isSubmitted || isLoading}
					onclick={() => submitSearch(onSubmitCallback)}
				>
					{#if state.isSubmitted || isLoading}
						<LoaderCircle class="animate-spin" />
					{:else}
						<Icon icon="bx:search-alt" width="24" height="24" /> <span class="ml-1">Search</span>
					{/if}
				</Button>
			</div>
		</div>
	</Card.Content>
</Card.Root>
