<script lang="ts">
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import { OSGSelectAirport } from '$lib/components/opsigo-ui/select-airport';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import { useSearchFormMultiCity } from './search-form-multi-city.svelte.js';
	import SearchFormValidationAlert from './search-form-validation-alert.svelte';
	import type { SearchFormMultiCityProps } from './types.js';
	import { cn } from '$lib/utils.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let {
		routes = $bindable(),
		invalidRoutes,
		removeFlight,
		class: className,
		removeBtnClass,
		variant
	}: SearchFormMultiCityProps = $props();

	const { state } = useSearchFormMultiCity();
</script>

{#if variant == 'combination'}
	<div class="space-y-4">
		<div class="space-y-2">
			{#each routes as route, i (route)}
				<div transition:slide>
					<div class="mb-2 flex items-center justify-between">
						<p class="text-sm font-semibold text-gray-700">Flight {i + 1}</p>

						<!-- REMOVE BUTTON -->
						{#if routes.length > 2}
							<Button
								variant="link"
								class="h-fit p-0 hover:no-underline"
								onclick={() => {
									removeFlight(i);
								}}
							>
								Remove
								<Icon icon="mdi:remove" width="24" height="24" />
							</Button>
						{/if}
					</div>
					<div class="mb-2">
						<SearchFormValidationAlert show={invalidRoutes[i]?.field === 'origin'}>
							{invalidRoutes[i].message}
						</SearchFormValidationAlert>
					</div>
					<div class="bg-accent rounded-md">
						<!-- ORIGIN - DESTINATION -->
						<div>
							<div class="py-2">
								<OSGSelectAirport
									triggerClass="whitespace-normal text-start"
									placeholder="Origin"
									bind:value={route.origin}
								>
									{#snippet icon()}
										<Icon icon="proicons:airplane-takeoff" width="24" height="24" />
									{/snippet}
								</OSGSelectAirport>
							</div>

							<div class="relative px-2">
								<Separator class="flex-1" />
								<Button
									variant="outline"
									class="text-primary hover:text-primary absolute right-2 top-[-1.1rem] flex-none rounded-full"
									size="icon"
									onclick={() => {
										state.hasSwitch[i] = !state.hasSwitch[i];
										let temp = route.origin;
										route.origin = route.destination;
										route.destination = temp;
									}}
								>
									<div
										class={cn('rotate-90 transition-transform duration-300', {
											'-rotate-90': state.hasSwitch[i]
										})}
									>
										<Icon icon="mi:switch" width={15} height={15} />
									</div>
								</Button>
							</div>

							<div class="py-2">
								<OSGSelectAirport
									triggerClass="whitespace-normal text-start"
									placeholder="Destination"
									bind:value={route.destination}
								>
									{#snippet icon()}
										<Icon icon="proicons:airplane-landing" width="24" height="24" />
									{/snippet}
								</OSGSelectAirport>
							</div>
						</div>

						<div class="px-2">
							<Separator class="mt-0!" />
						</div>

						<!-- DEPARTURE DATE - RETURN DATE -->
						<div class="py-2">
							<OSGDatePicker bind:value={route.departureDate} />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div>
		{#each routes as route, i (route)}
			<div
				class={cn('mb-4 flex w-full items-center gap-5', className)}
				animate:flip={{ duration: 300 }}
				transition:slide
			>
				<!-- ORIGIN - DESTINATION -->
				<div class="shadow-xs flex flex-1 items-center gap-2 rounded-lg border border-gray-200 p-1">
					<div class="flex-1">
						<OSGSelectAirport
							triggerClass="whitespace-normal text-start"
							placeholder="Origin"
							bind:value={route.origin}
						>
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
						class=" text-primary hover:text-primary flex-none rounded-full"
						size="icon"
						onclick={() => {
							state.hasSwitch[i] = !state.hasSwitch[i];
							let temp = route.origin;
							route.origin = route.destination;
							route.destination = temp;
						}}
					>
						<div class="transition-transform duration-300" class:rotate-180={state.hasSwitch[i]}>
							<Icon icon="mi:switch" />
						</div>
					</Button>

					<div class="flex-1">
						<OSGSelectAirport
							triggerClass="whitespace-normal text-start"
							placeholder="Destination"
							bind:value={route.destination}
						>
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
					class="shadow-xs flex flex-none items-center gap-2 rounded-lg border border-gray-200 p-1"
				>
					<div class="w-[320px]">
						<OSGDatePicker bind:value={route.departureDate} />
					</div>
				</div>

				<!-- REMOVE BUTTON -->
				{#if routes.length > 2}
					<Button
						variant="secondary"
						class={cn('h-[44px] w-[44px] flex-none text-lg', removeBtnClass)}
						size="icon"
						onclick={() => {
							removeFlight(i);
						}}
					>
						<Icon icon="mdi:remove" width="24" height="24" />
					</Button>
				{/if}
			</div>
		{/each}
	</div>
{/if}
