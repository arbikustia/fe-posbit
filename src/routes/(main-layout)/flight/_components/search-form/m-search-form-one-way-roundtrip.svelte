<script lang="ts">
	import { MOSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import { MOSGSelectAirport } from '$lib/components/opsigo-ui/select-airport';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import MSearchFormValidationAlert from './m-search-form-validation-alert.svelte';
	import { useSearchFormOneWayRoundtrip } from './search-form-one-way-roundtrip.svelte.js';
	import type { SearchFormOneWayRoundtripProps } from './types.js';

	let {
		route = $bindable(),
		flightType = $bindable(),
		isInvalidRoute
	}: SearchFormOneWayRoundtripProps = $props();

	const { state } = useSearchFormOneWayRoundtrip();
</script>

<div class="space-y-2">
	<!-- ORIGIN - DESTINATION -->
	<div class="bg-accent rounded-md">
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
			<MOSGSelectAirport placeholder="Destination" bind:value={route.destination}>
				{#snippet icon()}
					<Icon icon="proicons:airplane-landing" width="24" height="24" />
				{/snippet}
			</MOSGSelectAirport>
		</div>
	</div>

	<MSearchFormValidationAlert
		show={isInvalidRoute}
		title="Origin and Destination must be different"
	/>

	<!-- DEPARTURE DATE - RETURN DATE -->
	<div class="bg-accent rounded-md">
		<div class="flex items-center py-1 pr-2">
			<div class="flex-1">
				<MOSGDatePicker
					bind:value={route.departureDate}
					otherDate={flightType === 'oneway' ? undefined : route.returnDate}
					title="Select Departure Date"
				/>
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
				<MOSGDatePicker
					bind:value={route.returnDate}
					minValue={route.departureDate}
					otherDate={route.departureDate}
					title="Select Return Date"
				/>
			</div>
		{/if}
	</div>
</div>
