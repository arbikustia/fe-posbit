<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import type { SelectRouteProps } from './types';
	import { useSelectCountries } from './m-select-countries.svelte.ts';
	import MSelectCountry from '../select-country/m-select-country.svelte';
	import MSearchFormValidation from '../../../../../../../../../(component)/search-form-validation/m-search-form-validation.svelte';
	import { Tooltip } from 'bits-ui';

	let { route = $bindable(), isInvalidRoute }: SelectRouteProps = $props();
	const { state } = useSelectCountries();
</script>

<Tooltip.Provider>
	<div class="space-y-2">
		<MSearchFormValidation show={isInvalidRoute} title="Origin and Destination must be different" />
		<div class="rounded-md border">
			<div class="py-2">
				<p class="px-2 text-xs text-gray-500">Origin Country</p>
				<div class="flex gap-2 px-2 pt-2">
					<Icon icon="pepicons-pop:pinpoint" class="text-primary w-4" width="24" height="24" />
					<p class="font-semibold text-sm capitalize">{route.originCountry}</p>
				</div>
			</div>

			<div class="mx-2"><Separator /></div>

			<div class="py-2">
				<p class="px-2 text-xs text-gray-500">Destination Country</p>
				<MSelectCountry placeholder="Destination" bind:value={route.destinationCountry}>
					{#snippet icon()}
						<Icon icon="pepicons-pop:pinpoint" class="text-primary" width="24" height="24" />
					{/snippet}
				</MSelectCountry>
			</div>
		</div>
	</div>
</Tooltip.Provider>
