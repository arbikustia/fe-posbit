<script lang="ts">
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import { OSGSelectAirport } from '$lib/components/opsigo-ui/select-airport';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { useSearchFormOneWayRoundtrip } from './search-form-one-way-roundtrip.svelte.js';
	import SearchFormValidationAlert from './search-form-validation-alert.svelte';
	import type { SearchFormOneWayRoundtripProps } from './types.js';
	import { ERROR_MSG_IDENTICAL_ORIGIN_DESTINATION } from './constants.js';
	import { cn } from '$lib/utils.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { slide } from 'svelte/transition';

	let {
		route = $bindable(),
		flightType = $bindable(),
		isInvalidRoute,
		airportSelectWrapperClass,
		dateSelectWrapperClass,
		class: className,
		showLabel = false,
		variant
	}: SearchFormOneWayRoundtripProps = $props();

	const { state } = useSearchFormOneWayRoundtrip();
</script>

{#if variant == 'combination'}
	<div class="space-y-2 w-full">
		<!-- ORIGIN - DESTINATION -->
		<div class="bg-accent rounded-md">
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
						state.hasSwitch = !state.hasSwitch;
						let temp = route.origin;
						route.origin = route.destination;
						route.destination = temp;
					}}
				>
					<div
						class={cn('rotate-90 transition-transform duration-300', {
							'-rotate-90': state.hasSwitch
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

		<SearchFormValidationAlert show={isInvalidRoute}>
			{ERROR_MSG_IDENTICAL_ORIGIN_DESTINATION}
		</SearchFormValidationAlert>

		<!-- DEPARTURE DATE - RETURN DATE -->
		<div class="bg-accent rounded-md">
			<div class="flex items-center py-1 pr-2">
				<div class="flex-1">
					<OSGDatePicker bind:value={route.departureDate} />
				</div>
				<div class="flex flex-none items-center space-x-2">
					<Label class="text-xs font-normal text-gray-500" for="round-trip">Round-Trip?</Label>
					<Switch
						checked={flightType === 'roundtrip'}
						id="round-trip"
						onCheckedChange={(checked) => {
							flightType = checked ? 'roundtrip' : 'oneway';
						}}
					/>
				</div>
			</div>

			{#if flightType === 'roundtrip'}
				<div class="px-2">
					<Separator />
				</div>
				<div class="py-1" transition:slide>
					<OSGDatePicker
						bind:value={route.returnDate}
						minValue={route.departureDate}
						otherDate={route.departureDate}
						positionCalendar="end"
					/>
				</div>
			{/if}
		</div>
	</div>
{:else}
	<div>
		<div class={cn('flex w-full items-center gap-5', className)}>
			<!-- ORIGIN - DESTINATION -->
			<div
				class={cn(
					'shadow-xs flex flex-1 items-center gap-2 rounded-lg border border-gray-200 p-1',
					airportSelectWrapperClass
				)}
			>
				<div class="relative flex-1">
					{#if showLabel}
						<div class="absolute -top-7 text-sm font-medium text-gray-600">Origin</div>
					{/if}

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
				<div class="shrink-0">
					<Button
						variant="outline"
						class="text-primary hover:text-primary rounded-full"
						size="icon"
						onclick={() => {
							state.hasSwitch = !state.hasSwitch;
							let temp = route.origin;
							route.origin = route.destination;
							route.destination = temp;
						}}
					>
						<div class="transition-transform duration-300" class:rotate-180={state.hasSwitch}>
							<Icon icon="mi:switch" />
						</div>
					</Button>
				</div>

				<div class="relative flex-1">
					{#if showLabel}
						<div class="absolute -top-7 text-sm font-medium text-gray-600">Destination</div>
					{/if}

					<OSGSelectAirport
						triggerClass="whitespace-normal text-start"
						placeholder="Destination"
						bind:value={route.destination}
					>
						{#snippet icon()}
							<Icon icon="proicons:airplane-landing" width="24" height="24" />
						{/snippet}
					</OSGSelectAirport>

					<SearchFormValidationAlert show={isInvalidRoute}>
						{ERROR_MSG_IDENTICAL_ORIGIN_DESTINATION}
					</SearchFormValidationAlert>
				</div>
			</div>

			<!-- DEPARTURE DATE - RETURN DATE -->
			<div
				class={cn(
					'shadow-xs flex flex-none items-center gap-2 rounded-lg border border-gray-200 p-1',
					'text-center',
					dateSelectWrapperClass
				)}
			>
				<div class="relative w-full min-w-[160px]">
					{#if showLabel}
						<div class="absolute -top-7 text-sm font-medium text-gray-600">Departure Date</div>
					{/if}
					{#if flightType === 'oneway'}
						<OSGDatePicker bind:value={route.departureDate} />
					{:else}
						<OSGDatePicker bind:value={route.departureDate} otherDate={route.returnDate} />
					{/if}
				</div>
				<div class="relative w-full min-w-[160px]">
					{#if flightType === 'oneway'}
						<Button
							class="text-muted-foreground w-full"
							variant="ghost"
							onclick={() => {
								flightType = 'roundtrip';
							}}>Add Return</Button
						>
					{:else}
						{#if showLabel}
							<div class="absolute -top-7 text-sm font-medium text-gray-600">Return Date</div>
						{/if}
						<OSGDatePicker
							bind:value={route.returnDate}
							minValue={route.departureDate}
							otherDate={route.departureDate}
							positionCalendar="end"
						/>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}
