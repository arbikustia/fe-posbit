<script lang="ts">
	import { MOSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import { MOSGSelectAirport } from '$lib/components/opsigo-ui/select-airport';
	import Button from '$lib/components/ui/button/button.svelte';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import MSearchFormValidationAlert from './m-search-form-validation-alert.svelte';
	import { useSearchFormMultiCity } from './search-form-multi-city.svelte.js';
	import type { SearchFormMultiCityProps } from './types.js';

	let { routes = $bindable(), invalidRoutes, removeFlight }: SearchFormMultiCityProps = $props();

	const { state } = useSearchFormMultiCity();
</script>

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
					<MSearchFormValidationAlert
						show={!!invalidRoutes[i]?.field}
						title={invalidRoutes[i].message}
					/>
				</div>
				<div class="bg-accent rounded-md">
					<!-- ORIGIN - DESTINATION -->
					<div>
						<div class="py-2">
							<MOSGSelectAirport placeholder="Origin" bind:value={route.origin}>
								{#snippet icon()}
									<Icon icon="proicons:airplane-takeoff" width="24" height="24" />
								{/snippet}
							</MOSGSelectAirport>
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
							<MOSGSelectAirport placeholder="Destination" bind:value={route.destination}>
								{#snippet icon()}
									<Icon icon="proicons:airplane-landing" width="24" height="24" />
								{/snippet}
							</MOSGSelectAirport>
						</div>
					</div>

					<div class="px-2">
						<Separator class="mt-0!" />
					</div>

					<!-- DEPARTURE DATE - RETURN DATE -->
					<div class="py-2">
						<MOSGDatePicker bind:value={route.departureDate} title="Select Departure Date" />
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
