<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { redirectToSearchFlight, saveLastSearchFligth } from '$lib/helpers/search-flight-helper';
	import type { SearchFlightParam } from '$lib/types/SearchFlightParam';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { ArrowRight, ArrowRightLeft } from '@lucide/svelte';
	import dayjs from 'dayjs';
	import * as Tooltip from '$lib/components/ui/tooltip';

	type LastSearchItemProps = {
		searchFlight: SearchFlightParam;
	};

	let { searchFlight }: LastSearchItemProps = $props();

	function onClickItem() {
		saveLastSearchFligth(searchFlight);
		redirectToSearchFlight(searchFlight);
	}

	const route = $derived.by(() => {
		return searchFlight.flightType === 'multicity'
			? searchFlight.multicityRoutes?.[0]
			: searchFlight.route;
	});
</script>

<Button
	variant="outline"
	class="flex items-center justify-between rounded-lg border bg-white py-7"
	onclick={onClickItem}
>
	<div class="flex items-center space-x-4">
		<div>
			<Icon icon="mdi:airplane-search" width="24" height="24" />
		</div>
		<div class="text-left">
			<div class={cn('flex items-center space-x-2 font-medium text-gray-700')}>
				<div>
					{route?.origin}
				</div>
				{#if searchFlight.flightType === 'roundtrip'}
					<ArrowRightLeft size={16} />
				{:else}
					<ArrowRight size={16} />
				{/if}
				<div>
					{route?.destination}
				</div>

				{#if searchFlight.flightType === 'multicity'}
					<Tooltip.Provider>
						<Tooltip.Root delayDuration={0}>
							<Tooltip.Trigger>
								<div class="text-[0.7rem] text-gray-500">
									(+{(searchFlight.multicityRoutes?.length ?? 0) - 1} more flights)
								</div>
							</Tooltip.Trigger>
							<Tooltip.Content sideOffset={14}>
								<div class="space-y-2">
									{#each (searchFlight.multicityRoutes ?? []).slice(1, searchFlight.multicityRoutes?.length) as multicityRoute}
										<div class="flex items-center space-x-4">
											<div class="flex items-center space-x-2 font-medium text-gray-700">
												<div>
													{multicityRoute?.origin}
												</div>

												<ArrowRight size={16} />

												<div>
													{multicityRoute?.destination}
												</div>
											</div>
											<div class="text-xs text-gray-500">
												{dayjs(multicityRoute?.departureDate).format('DD MMM YYYY')}
											</div>
										</div>
									{/each}
								</div>
							</Tooltip.Content>
						</Tooltip.Root>
					</Tooltip.Provider>
				{/if}
			</div>
			<div class="text-xs text-gray-500">
				{dayjs(route?.departureDate).format('DD MMM YYYY')} · {searchFlight.adult +
					searchFlight.child +
					searchFlight.infant} pax
			</div>
		</div>
	</div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="h-5 w-5 text-gray-500"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
	</svg>
</Button>
