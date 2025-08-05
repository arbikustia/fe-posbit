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

	type SearchFormProps = {
		variant?: 'default' | 'sticky';
	};

	let { variant }: SearchFormProps = $props();

	const { state: comState, submitSearch } = useSearchForm();

	let selectCompany = $state<HTMLElement>(null!);
</script>

{#if variant === 'sticky'}
	<div class="bg-card sticky top-0 z-10 border-y shadow-sm">
		<div class="mx-auto max-w-6xl px-4 py-2">
			<Tooltip.Provider>
				<div class="space-y-2">
					<div class="xl:max-w-160 flex w-full max-w-md items-center">
						<SelectTrainType bind:value={comState.searchModel.trainType} variant="select" />
						<SelectTripType bind:value={comState.searchModel.tripType} variant="select" />
						<div bind:this={selectCompany}>
							<OSGSelectCompany
								bind:value={comState.searchModel.companyCode}
								triggerClass="p-0 h-fit px-2"
							></OSGSelectCompany>
						</div>
						<PaxNumber
							bind:adult={comState.searchModel.adult}
							bind:infant={comState.searchModel.infant}
							triggerClass="p-0 px-2 h-fit"
						/>
					</div>

					<div class="flex items-center gap-4">
						<SelectRoute
							variant="default"
							bind:route={comState.searchModel.route as Route}
							isInvalidRoute={comState.validation.isInvalidRoute}
							class="p-0"
							showLabel={false}
						/>
						<SelectSchedule
							bind:route={comState.searchModel.route as Route}
							bind:tripType={comState.searchModel.tripType}
							trainType={comState.searchModel.trainType}
							class="p-0"
							showLabel={false}
						/>
						<Button
							class={cn('h-auto w-[120px] flex-none text-lg')}
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
		</div>
	</div>
{:else}
	<Tooltip.Provider>
		<div class="space-y-4">
			<SelectTrainType bind:value={comState.searchModel.trainType} />

			<Card.Root>
				<Card.Content class="space-y-10">
					<div class="flex items-center justify-between gap-x-4">
						<div class="flex items-center gap-4">
							<SelectTripType bind:value={comState.searchModel.tripType} />
							<div bind:this={selectCompany}>
								<OSGSelectCompany bind:value={comState.searchModel.companyCode}></OSGSelectCompany>
							</div>
						</div>
						<PaxNumber adult={comState.searchModel.adult} infant={comState.searchModel.infant} />
					</div>

					<div class="flex items-center gap-4">
						<SelectRoute
							variant="default"
							bind:route={comState.searchModel.route as Route}
							isInvalidRoute={comState.validation.isInvalidRoute}
						/>
						<SelectSchedule
							bind:route={comState.searchModel.route as Route}
							bind:tripType={comState.searchModel.tripType}
							trainType={comState.searchModel.trainType}
						/>
						<Button
							class={cn('h-full w-[120px] flex-none text-lg')}
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
				</Card.Content>
			</Card.Root>
		</div>
		<SearchFormValidation
			open={comState.validation.isInvalidCompany}
			message="Please select a company"
			target={selectCompany}
		/>
	</Tooltip.Provider>
{/if}
