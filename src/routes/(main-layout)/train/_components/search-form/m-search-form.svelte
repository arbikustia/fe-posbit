<script lang="ts">
	import { MOSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import type { Route } from '$lib/types/app/train/SearchTrainParam';
	import { cn } from '$lib/utils';
	import { LoaderCircle } from '@lucide/svelte';
	import { MPaxNumer } from '../pax-number';
	import { MSelectRoute } from '../select-route';
	import { MSelectSchedule } from '../select-schedule';
	import { SelectTrainType } from '../select-train-type';
	import { SelectTripType } from '../select-trip-type';
	import { useSearchForm } from './search-form.svelte.js';
	import Icon from '@iconify/svelte';
	import MSearchFormValidation from '../../../(component)/search-form-validation/m-search-form-validation.svelte';
	import * as Drawer from '$lib/components/ui/drawer';

	let {
		variant = 'default',
		isOpen = $bindable()
	}: { variant?: 'default' | 'drawer'; isOpen?: boolean } = $props();

	const { state: comState, submitSearch } = useSearchForm();

	// scroll into invalid form
	$effect(() => {
		const { isInvalidCompany, isInvalidRoute } = comState.validation;
		if (isInvalidCompany || isInvalidRoute) {
			if (typeof document !== undefined) {
				document?.querySelector('.validation-alert')?.scrollIntoView({
					block: 'center',
					behavior: 'smooth'
				});
			}
		}
	});
</script>

{#snippet searchForm()}
	<div class="mb-6 mt-2 px-1">
		<SelectTrainType bind:value={comState.searchModel.trainType} />
	</div>

	<Card.Root class="mb-5 py-0">
		<Card.Content class="space-y-6 p-2 py-6">
			<div class="space-y-2">
				<MSearchFormValidation
					show={comState.validation.isInvalidCompany}
					title="Please select a company"
				/>
				<div class="flex items-center gap-4">
					<SelectTripType
						classContent="rounded-full h-7 border"
						classItem="rounded-full py-0"
						bind:value={comState.searchModel.tripType}
					/>
					<div class="overflow-hidden">
						<MOSGSelectCompany
							bind:value={comState.searchModel.companyCode}
							triggerClass="bg-transparent text-primary"
						/>
					</div>
				</div>
			</div>

			<div>
				<MSelectRoute
					bind:route={comState.searchModel.route as Route}
					isInvalidRoute={comState.validation.isInvalidRoute}
				/>
			</div>

			<MSelectSchedule
				bind:route={comState.searchModel.route as Route}
				bind:tripType={comState.searchModel.tripType}
				trainType={comState.searchModel.trainType}
			/>

			<MPaxNumer adult={comState.searchModel.adult} infant={comState.searchModel.infant} />
		</Card.Content>
	</Card.Root>
{/snippet}

{#snippet searchButton()}
	<Button class={cn('w-full flex-none')} disabled={comState.isSubmitted} onclick={submitSearch}>
		{#if comState.isSubmitted}
			<LoaderCircle class="animate-spin" />
		{:else}
			<Icon icon="bx:search-alt" width="24" height="24" />
			<span class="ml-1">Search</span>
		{/if}
	</Button>
{/snippet}

{#if variant === 'drawer'}
	<Drawer.Root bind:open={isOpen}>
		<Drawer.Content class="h-fit p-4 pb-2 pt-0">
			<div class="overflow-y-auto pt-4">
				{@render searchForm()}

				<div>
					{@render searchButton()}
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{:else}
	<div class="p-2">
		{@render searchForm()}

		<div class="relative  px-10">
			{@render searchButton()}
		</div>
	</div>
{/if}
