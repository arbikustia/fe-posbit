<script lang="ts">
	import { MOSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import Button from '$lib/components/ui/button/button.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import Switch from '$lib/components/ui/switch/switch.svelte';
	import { cn } from '$lib/utils.js';
	import Icon from '@iconify/svelte';
	import { slide } from 'svelte/transition';
	import type { SelectRouteProps } from './types';
	import { useSelectRoute } from './select-route.svelte.js';
	import { MSelectStation } from '../select-station';
	import { MSearchFormValidation } from '../../../(component)/search-form-validation';

	let { route = $bindable(), class: className, isInvalidRoute }: SelectRouteProps = $props();
	const { state } = useSelectRoute();
</script>

<div class="space-y-2">
	<MSearchFormValidation show={isInvalidRoute} title="Origin and Destination must be different" />
	<!-- ORIGIN - DESTINATION -->
	<div class="rounded-md border">
		<div class="py-2">
			<p class="px-2 text-xs text-gray-500">Origin</p>
			<MSelectStation placeholder="Origin" bind:value={route.origin}>
				{#snippet icon()}
					<Icon icon="mingcute:train-line" class="text-primary" width="24" height="24" />
				{/snippet}
			</MSelectStation>
		</div>

		<div class="relative px-2">
			<Separator class="flex-1" />
			<Button
				variant="outline"
				class="absolute right-2 top-[-1.1rem] flex-none rounded-full text-primary hover:text-primary"
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
			<p class="px-2 text-xs text-gray-500">Destination</p>
			<MSelectStation placeholder="Destination" bind:value={route.destination}>
				{#snippet icon()}
					<Icon icon="mingcute:train-line" class="text-primary" width="24" height="24" />
				{/snippet}
			</MSelectStation>
		</div>
	</div>
</div>
