<script lang="ts">
	import type { Route } from '$lib/types/app/train/SearchTrainParam';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { SelectStation } from '../select-station';
	import { Button } from '$lib/components/ui/button';
	import { useSelectRoute } from './select-route.svelte.js';
	import { SearchFormValidation } from '../../../(component)/search-form-validation';
	import type { SelectRouteProps } from './types';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let {
		route = $bindable(),
		class: className,
		isInvalidRoute,
		showLabel = true,
		variant
	}: SelectRouteProps = $props();
	const { state: comState } = useSelectRoute();

	let selectStationOrigin = $state<HTMLElement>(null!);
</script>

{#if variant == 'combination'}
	<div class="rounded-md border">
		<div class="py-2">
			<p class="px-2 text-xs text-gray-500">Origin</p>
			<div bind:this={selectStationOrigin}>
				<SelectStation
					triggerClass="whitespace-normal text-start"
					placeholder="Origin"
					bind:value={route.origin}
				>
					{#snippet icon()}
						<Icon icon="mingcute:train-line" width="24" height="24" />
					{/snippet}
				</SelectStation>
			</div>
		</div>

		<div class="relative px-2">
			<Separator class="flex-1" />
			<Button
				variant="outline"
				class="text-primary hover:text-primary absolute right-2 top-[-1.1rem] flex-none rounded-full"
				size="icon"
				onclick={() => {
					comState.hasSwitch = !comState.hasSwitch;
					let temp = route.origin;
					route.origin = route.destination;
					route.destination = temp;
				}}
			>
				<div
					class={cn('rotate-90 transition-transform duration-300', {
						'-rotate-90': comState.hasSwitch
					})}
				>
					<Icon icon="mi:switch" width={15} height={15} />
				</div>
			</Button>
		</div>

		<div class="py-2">
			<p class="px-2 text-xs text-gray-500">Destination</p>
			<div class="truncate">
				<SelectStation
					triggerClass="whitespace-normal text-start"
					placeholder="Destination"
					bind:value={route.destination}
				>
					{#snippet icon()}
						<Icon class="scale-x-[-1]" icon="mingcute:train-line" width="24" height="24" />
					{/snippet}
				</SelectStation>
			</div>
		</div>
	</div>
{:else}
	<div
		class={cn(
			'shadow-xs flex flex-1 shrink-0 items-center gap-2 rounded-lg border border-gray-200 p-1',
			className
		)}
	>
		<div class="relative max-w-[50%] flex-1">
			{#if showLabel}
				<div class="absolute -top-7 text-sm font-medium text-gray-600">Origin</div>
			{/if}

			<div bind:this={selectStationOrigin}>
				<SelectStation
					triggerClass="whitespace-normal text-start"
					placeholder="Origin"
					bind:value={route.origin}
				>
					{#snippet icon()}
						<Icon icon="mingcute:train-line" width="24" height="24" />
					{/snippet}
				</SelectStation>
			</div>
		</div>
		<div>
			<Button
				variant="outline"
				class="text-primary hover:text-primary rounded-full"
				size="icon"
				onclick={() => {
					comState.hasSwitch = !comState.hasSwitch;
					let temp = route.origin;
					route.origin = route.destination;
					route.destination = temp;
				}}
			>
				<div class="transition-transform duration-300" class:rotate-180={comState.hasSwitch}>
					<Icon icon="mi:switch" />
				</div>
			</Button>
		</div>

		<div class="relative max-w-[50%] flex-1">
			{#if showLabel}
				<div class="absolute -top-7 text-sm font-medium text-gray-600">Destination</div>
			{/if}
			<div class="truncate">
				<SelectStation
					triggerClass="whitespace-normal text-start"
					placeholder="Destination"
					bind:value={route.destination}
				>
					{#snippet icon()}
						<Icon class="scale-x-[-1]" icon="mingcute:train-line" width="24" height="24" />
					{/snippet}
				</SelectStation>
			</div>
		</div>
	</div>
{/if}

<SearchFormValidation
	open={isInvalidRoute}
	message="Origin and Destination must be different"
	target={selectStationOrigin}
/>
