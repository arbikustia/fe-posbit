<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Tooltip } from 'bits-ui';
	import { OSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import { PaxNumber } from '../pax-number';
	import { SelectTrainType } from '../select-train-type';
	import { SelectTripType } from '../select-trip-type';
	import { SelectRoute } from '../select-route';
	import { useSearchForm } from './search-form.svelte.js';
	import type { Route } from '$lib/types/app/train/SearchTrainParam';
	import { SelectSchedule } from '../select-schedule';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { LoaderCircle } from '@lucide/svelte';
	import Icon from '@iconify/svelte';
	import { SearchFormValidation } from '../../../(component)/search-form-validation';

	const { state: comState, submitSearch } = useSearchForm();

	let selectCompany = $state<HTMLElement>(null!);
</script>

<Tooltip.Provider>
	<div class="space-y-4">
		<SelectTrainType bind:value={comState.searchModel.trainType} />

		<Card.Root>
			<Card.Content class="space-y-2">
				<div class="flex items-center gap-2">
					<SelectTripType
						classContent="rounded-full h-7 border"
						classItem="rounded-full py-0"
						bind:value={comState.searchModel.tripType}
					/>
					<div class="overflow-hidden">
						<OSGSelectCompany
							bind:value={comState.searchModel.companyCode}
							triggerClass="p-0 h-fit px-2"
						></OSGSelectCompany>
					</div>
				</div>
				<SelectRoute
					variant="combination"
					bind:route={comState.searchModel.route as Route}
					isInvalidRoute={comState.validation.isInvalidRoute}
				/>
				<SelectSchedule
					variant="combination"
					bind:route={comState.searchModel.route as Route}
					bind:tripType={comState.searchModel.tripType}
					trainType={comState.searchModel.trainType}
				/>

				<PaxNumber
					variant="combination"
					triggerClass="w-full border"
					adult={comState.searchModel.adult}
					infant={comState.searchModel.infant}
				/>
			</Card.Content>
		</Card.Root>
		<div class="flex justify-end w-full px-5">
			<Button
				class={cn('h-full w-full flex-none text-lg')}
				disabled={comState.isSubmitted}
				onclick={submitSearch}
			>
				{#if comState.isSubmitted}
					<LoaderCircle class="animate-spin" />
				{:else}
					<Icon icon="bx:search-alt" width="24" height="24" />
					<span class="ml-1">Search</span>
				{/if}
			</Button>
		</div>
	</div>
	<SearchFormValidation
		open={comState.validation.isInvalidCompany}
		message="Please select a company"
		target={selectCompany}
	/>
</Tooltip.Provider>
