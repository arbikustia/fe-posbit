<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Icon from '@iconify/svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { PaxNumberProps } from './type';
	import { cn } from '$lib/utils';
	import SelectPaxItem from './select-pax-item.svelte';
	import { useSelectPax } from './select-pax.svelte';

	let {
		adult = $bindable(),
		child = $bindable(),
		triggerClass,
		showIcon = true,
		variant
	}: PaxNumberProps = $props();

	const { state, displaySelectedText, reset, closeAndFocusTrigger, adultChange, childChange } =
		useSelectPax();

	function setParentState() {
		adult = state.adult;
		child = state.child;
	}
</script>

{#snippet trigger(props: Record<string, unknown>)}
	{#if displaySelectedText({ adult, child }) != ''}
		{#if variant == 'combination'}
			<Button
				variant="ghost"
				{...props}
				class={cn(
					'hover:text-primary flex w-fit justify-start px-2 font-semibold',
					triggerClass
				)}
				role="combobox"
			>
				{#if showIcon}
					<div class="">
						<Icon icon="cuida:user-outline" class="text-primary" width="24" height="24" />
					</div>
				{/if}
				<div class="truncate text-sm">{displaySelectedText({ adult, child })}</div>
			</Button>
		{:else}
			<Button
				variant="ghost"
				{...props}
				class={cn(
					'text-primary hover:text-primary flex w-fit justify-start px-2 font-semibold',
					triggerClass
				)}
				role="combobox"
			>
				{#if showIcon}
					<div class="">
						<Icon icon="cuida:user-outline" width="24" height="24" />
					</div>
				{/if}
				<div class="truncate text-sm">{displaySelectedText({ adult, child })}</div>
				<ChevronDown class="text-primary/70 ml-auto size-4  shrink-0" />
			</Button>
		{/if}
	{/if}
{/snippet}

<Popover.Root bind:open={state.isOpenList}>
	<Popover.Trigger bind:ref={state.triggerRef}>
		{#snippet child({ props })}
			{@render trigger(props)}
		{/snippet}
	</Popover.Trigger>
	<Popover.Content
		class="w-[340px] space-y-6 p-5"
		side="bottom"
		align="start"
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			setParentState();
		}}
	>
		<SelectPaxItem paxType="Adult" ageInfo="12++ years" value={state.adult} onChange={adultChange}>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:person" width="25" height="30" class="text-muted-foreground" />
			{/snippet}
		</SelectPaxItem>

		<SelectPaxItem paxType="Child" value={state.child} ageInfo="2-11 years" onChange={childChange}>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:child" width="25" height="25" class="text-muted-foreground" />
			{/snippet}
		</SelectPaxItem>

		<div class="space-x-3 text-right">
			{#if state.adult == 1 && state.child == 0}
				<Button variant="ghost" disabled>Reset</Button>
			{:else}
				<Button variant="ghost" onclick={() => reset()}>Reset</Button>
			{/if}
			<Button onclick={() => closeAndFocusTrigger()} class="w-[120px]">Done</Button>
		</div>
	</Popover.Content>
</Popover.Root>
