<script lang="ts">
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import { OSGSelectAirport } from '$lib/components/opsigo-ui/select-airport';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Dialog from '$lib/components/ui/dialog';
	import { getAirportName } from '$lib/helpers/search-flight-helper.js';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import dayjs from 'dayjs';
	import { fade } from 'svelte/transition';
	import {
		ERROR_MSG_IDENTICAL_ORIGIN_DESTINATION,
		VALIDATION_ALERT_SHOW_DURATION
	} from './constants.js';
	import { useSearchFormMultiCity } from './search-form-multi-city.svelte.js';
	import SearchFormValidationAlert from './search-form-validation-alert.svelte';
	import type {
		MulticityRouteErrorForm,
		SearchFormMultiCityProps,
		SearchFormValidation
	} from './types.js';
	import { type Route } from '$lib/types/SearchFlightParam.js';

	let { routes = $bindable() }: SearchFormMultiCityProps = $props();

	const { state: searchFormState } = useSearchFormMultiCity();

	let open = $state(false);
	let flightRoutes = $state([...routes]);
	let invalidRoutes = $state<SearchFormValidation['invalidRoutes']>([]);

	const filledRoutes = $derived.by(() => {
		return routes.filter((route) => !!route.origin && !!route.destination);
	});

	function addFlight() {
		flightRoutes.push({
			origin: '',
			destination: '',
			departureDate: dayjs().add(flightRoutes.length, 'day').format('YYYY-MM-DD')
		});
	}

	function removeFlight(idx: number) {
		flightRoutes.splice(idx, 1);
	}

	function showErrors(errors: MulticityRouteErrorForm[]) {
		invalidRoutes = errors;
		setTimeout(() => {
			invalidRoutes = [];
		}, VALIDATION_ALERT_SHOW_DURATION);
	}

	function getErrors() {
		const errors: MulticityRouteErrorForm[] = [];
		flightRoutes.forEach((route, i) => {
			if (errors.length < 1) {
				if (!route.origin || !route.destination) {
					errors[i] = {
						field: !route.origin ? 'origin' : 'destination',
						message: `${!route.origin ? 'Origin' : 'Destination'} field is required`
					};
				} else if (route.origin === route.destination) {
					errors[i] = {
						field: 'destination',
						message: ERROR_MSG_IDENTICAL_ORIGIN_DESTINATION
					};
				}
			}
		});

		return errors;
	}

	function onUpdate() {
		const errors = getErrors();
		if (errors.length > 0) {
			showErrors(errors);
			return;
		}
		routes = flightRoutes;
		open = false;
	}
</script>

{#snippet routeItem(route: Route, variant: 'detailed' | 'compact' | 'minimal' = 'detailed')}
	<button
		onclick={() => (open = true)}
		class={cn(
			'flex flex-1 items-center justify-between gap-2 rounded-lg border border-gray-200 bg-gray-50 p-2 px-2 text-sm shadow-xs',
			{
				'max-w-76': variant !== 'detailed',
				'max-w-116': variant === 'detailed'
			}
		)}
	>
		{#if variant === 'compact'}
			<p class="truncate text-ellipsis">
				{getAirportName(route.origin)} → {getAirportName(route.destination)}
				∙ {dayjs(route.departureDate).format('D MMM')}
			</p>
		{:else if variant === 'minimal'}
			<p class="truncate text-ellipsis">
				{route.origin} → {route.destination} ∙ {dayjs(route.departureDate).format('D MMM')}
			</p>
		{:else}
			<p class="truncate text-ellipsis">
				{getAirportName(route.origin)} ({route.origin}) → {getAirportName(route.destination)} ({route.destination})
				∙ {dayjs(route.departureDate).format('D MMM YYYY')}
			</p>
		{/if}
	</button>
{/snippet}

<div class="flex flex-1 items-center gap-2 px-1">
	<p class="text-nowrap text-sm font-semibold text-gray-600">{filledRoutes.length} Flights</p>
	{#each filledRoutes as route}
		{@render routeItem(
			route,
			filledRoutes.length > 2 ? (filledRoutes.length > 3 ? 'minimal' : 'compact') : 'detailed'
		)}
	{/each}
</div>

<Dialog.Root bind:open>
	<Dialog.Content class="max-w-[50vw] overflow-x-auto">
		<Dialog.Header>
			<Dialog.Title>Select Flights</Dialog.Title>
		</Dialog.Header>
		<div>
			{#each flightRoutes as route, i (route)}
				<div class="mb-4 flex w-full items-center gap-5" transition:fade>
					<!-- ORIGIN - DESTINATION -->
					<div
						class="flex flex-1 items-center gap-2 rounded-lg border border-gray-200 p-1 shadow-xs"
					>
						<div class="flex-1">
							<OSGSelectAirport placeholder="Origin" bind:value={route.origin}>
								{#snippet icon()}
									<Icon icon="proicons:airplane-takeoff" width="24" height="24" />
								{/snippet}
							</OSGSelectAirport>
							<SearchFormValidationAlert show={invalidRoutes[i]?.field === 'origin'}>
								{invalidRoutes[i].message}
							</SearchFormValidationAlert>
						</div>

						<Button
							variant="outline"
							class=" flex-none rounded-full text-primary hover:text-primary"
							size="icon"
							onclick={() => {
								searchFormState.hasSwitch[i] = !searchFormState.hasSwitch[i];
								let temp = route.origin;
								route.origin = route.destination;
								route.destination = temp;
							}}
						>
							<div
								class="transition-transform duration-300"
								class:rotate-180={searchFormState.hasSwitch[i]}
							>
								<Icon icon="mi:switch" />
							</div>
						</Button>

						<div class="flex-1">
							<OSGSelectAirport placeholder="Destination" bind:value={route.destination}>
								{#snippet icon()}
									<Icon icon="proicons:airplane-landing" width="24" height="24" />
								{/snippet}
							</OSGSelectAirport>
							<SearchFormValidationAlert show={invalidRoutes[i]?.field === 'destination'}>
								{invalidRoutes[i].message}
							</SearchFormValidationAlert>
						</div>
					</div>

					<!-- DEPARTURE DATE - RETURN DATE -->
					<div
						class="flex flex-none items-center gap-2 rounded-lg border border-gray-200 p-1 shadow-xs"
					>
						<div class="w-[200px]">
							<OSGDatePicker bind:value={route.departureDate} />
						</div>
					</div>

					<!-- REMOVE BUTTON -->
					{#if flightRoutes.length > 2}
						<div transition:fade>
							<Button
								variant="secondary"
								class="h-[44px] w-[44px] flex-none text-lg"
								size="icon"
								onclick={() => {
									removeFlight(i);
								}}
							>
								<Icon icon="mdi:remove" width="24" height="24" />
							</Button>
						</div>
					{/if}
				</div>
			{/each}

			<div class="flex">
				{#if (flightRoutes.length ?? 0) < 5}
					<!-- ADD FLIGHT BUTTON -->
					<Button variant="secondary" size="lg" onclick={addFlight}>
						<Icon icon="material-symbols:add-rounded" width="24" height="24" />
						<span class="ml-1">Add Flight</span>
					</Button>
				{/if}

				<Button
					class={cn('ml-auto h-[44px] w-[120px] flex-none text-lg')}
					size="lg"
					onclick={onUpdate}
				>
					Update
				</Button>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
