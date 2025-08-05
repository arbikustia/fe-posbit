<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { Accordion } from 'bits-ui';
	import { fly, slide } from 'svelte/transition';
	import { TripTimeline } from '../../../_components/trip-timeline';
	import { TrainCardClass } from '../train-card-class';

	let { onclick } = $props();
</script>

<Accordion.Item class={cn('cursor-pointer border-b')}>
	<Accordion.Header class="relative flex flex-1 gap-x-4 p-4">
		<div class="flex flex-1 items-center justify-end">
			<!-- TRAIN LOGO -->
			<div class="mr-auto flex items-center gap-3">
				<div>
					<div
						class="flex h-[45px] w-[45px] items-center justify-center rounded-full bg-white shadow-sm"
					>
						<img
							class="h-[38px] w-[38px] object-contain"
							src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/kai.png"
							alt="logo"
						/>
					</div>
				</div>

				<div>
					<div class="text-sm font-semibold">ARGO PARAHYANGAN</div>
					<div class="text-xs">KA-137</div>
				</div>
			</div>

			<!-- DEPARTURE -> ARRIVAL -->
			<div class="ml-3 flex items-center gap-1">
				<!-- ORIGIN -->
				<div class="w-[50px] text-center leading-none">
					<div class="font-medium">06:10</div>
					<div class="text-muted-foreground text-sm">GMR</div>
				</div>

				<!-- DURATION -->
				<div class="flex w-[100px] items-center justify-center text-center">
					<div class="border-muted-foreground w-3 border-b border-dashed"></div>
					<div class="text-muted-foreground w-[60px] text-sm">
						<div class="whitespace-nowrap">4h 10m</div>
					</div>

					<div class="border-muted-foreground w-3 border-b border-dashed"></div>
				</div>

				<!-- DESTINATION -->
				<div class="w-[50px] text-center leading-none">
					<div class="font-medium">10:00</div>
					<div class="text-muted-foreground text-sm">BD</div>
				</div>
			</div>

			<!-- SELECT PRICE -->
			<div class="ml-4 flex items-center">
				<TrainCardClass value="1" />

				<Button
					onclick={(e) => {
						e.stopPropagation();
						onclick();
					}}
					size="sm"
					class="ml-4 px-4">Select</Button
				>
			</div>
		</div>
		<Accordion.Trigger
			class="select-none text-[15px] font-medium transition-all [&[data-state=open]>svg]:rotate-180"
			onclick={(e) => e.stopPropagation()}
		>
			<ChevronDown
				class="text-muted-foreground size-4 shrink-0 transition-transform duration-200"
			/>
		</Accordion.Trigger>

		<!-- selected indicator -->
		<!-- {#if isSelected}
			<span class="absolute bottom-0 left-0 top-0 w-1 rounded-r-md bg-primary"></span>
		{/if} -->
	</Accordion.Header>

	<Accordion.Content class="bg-gray-100 p-8" forceMount onclick={(e) => e.stopPropagation()}>
		{#snippet child({ props, open })}
			{#if open}
				<div {...props} transition:slide>
					<div class="flex justify-center">
						<div class="flex flex-col items-center gap-8" in:fly={{ x: -500, duration: 500 }}>
							<!-- Train Detail -->
							<TripTimeline />
						</div>
					</div>

					<div class="mt-4 space-y-2 text-sm">
						<p class="text-base font-semibold">Important Information</p>
						<div>
							<p class="text-base font-semibold">Check-In</p>
							<ul class="list-disc pl-7">
								<li>
									Boarding passes can be printed at self-service machines at all stations 7 days
									before the train's departure time.
								</li>

								<li>
									For check-in within 24 hours of the train's departure, boarding pass can only be
									printed at the departure station.
								</li>
								<li>
									Passengers can get an electronic boarding pass through this application starting 2
									hours before the train's scheduled departure.
								</li>
							</ul>
						</div>
						<div>
							<p class="text-base font-semibold">Passenger</p>
							<ul class="list-disc pl-7">
								<li>
									Pregnant women who rides a long-distance train must meet the following criteria:
									<ol class="list-inside list-[lower-alpha] pl-5">
										<li>Pregnancy age between 14 and 28 weeks</li>
										<li>In good health</li>
										<li>No complications during pregnancy</li>
										<li>Accompanied by at least one adult passenger</li>
									</ol>
								</li>
								<li>
									Passengers 3 years old and older are considered adults, hence subject to adult
									fares, and will be assigned seats based on their tickets.
								</li>
								<li>
									Passengers under 3 years old are considered Infants and will not be charged a
									ticket fare if they do not take their own seat.
								</li>
								<li>
									Infant passengers will be charged a ticket fare if they take their own seat.
								</li>
							</ul>
						</div>
					</div>
				</div>
			{/if}
		{/snippet}
	</Accordion.Content>
</Accordion.Item>
