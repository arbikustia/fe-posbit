<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Check from '@lucide/svelte/icons/check';
	import Icon from '@iconify/svelte';
	import { ChevronDown } from '@lucide/svelte';
	import { cn } from '$lib/utils';
	import Button from '$lib/components/ui/button/button.svelte';
	import { useSelectCountry } from './select-country.svelte.js';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let {
		value = $bindable(),
		triggerClass,
		variant,
		showIcon = true,
		label,
		disabled = false
	}: any = $props();

	let { state, closeAndFocusTrigger } = useSelectCountry();
</script>

<Popover.Root>
	<div class="flex w-full flex-col gap-1">
		{#if variant == 'default'}
			<span class="text-sm font-medium text-gray-600">{label}</span>
		{/if}
		{#if variant == 'compact'}
			<Popover.Trigger
				{disabled}
				class={{
					variant: 'outline',
					class: cn(
						'text-primary hover:text-primary flex h-auto w-auto justify-between px-3 py-3',
						triggerClass
					)
				}}
				role="combobox"
			>
				<div class="flex items-center gap-2">
					{#if showIcon}
						<div class="text-primary">
							<Icon icon="pepicons-pop:pinpoint" width="16" height="16" />
						</div>
					{/if}
					<div class="text-sm font-medium">
						{value}
					</div>
				</div>
			</Popover.Trigger>
		{:else}
			<Popover.Trigger
				{disabled}
				class={buttonVariants({
					variant: 'outline',
					class: cn(
						'text-primary hover:text-primary flex h-auto w-auto justify-between px-3 py-3',
						triggerClass
					)
				})}
				role="combobox"
			>
				<div class="flex items-center gap-2">
					{#if showIcon}
						<div class="text-primary">
							<Icon icon="pepicons-pop:pinpoint" width="24" height="24" />
						</div>
					{/if}
					<div class="text-sm font-medium">
						{value}
					</div>
				</div>
				<ChevronDown class="text-primary/70 ml-2 size-4 shrink-0" />
			</Popover.Trigger>
		{/if}
	</div>
	<Popover.Content class="flex w-56 flex-col p-2">
		{#each state.displayedItems as trip}
			<Button
				variant="ghost"
				onclick={() => {
					value = trip.value;
					closeAndFocusTrigger();
				}}
				class="hover:bg-accent hover:text-accent-foreground cursor-pointer px-3 py-2 text-sm"
			>
				<div class="flex w-full items-center justify-between">
					{trip.label}
					<Check class={cn('size-4', value !== trip.value && 'opacity-0')} />
				</div>
			</Button>
		{/each}
	</Popover.Content>
</Popover.Root>
