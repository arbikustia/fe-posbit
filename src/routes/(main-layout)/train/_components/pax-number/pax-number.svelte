<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import Icon from '@iconify/svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import PaxNumberItem from './pax-number-item.svelte';
	import { usePaxNumber } from './pax-number.svelte.js';
	import type { PaxNumberProps } from './types';
	import { cn } from '$lib/utils';

	let {
		adult = $bindable(),
		infant = $bindable(),
		triggerClass,
		showIcon = true,
		variant
	}: PaxNumberProps = $props();

	const { state, displaySelectedText, reset, closeAndFocusTrigger, adultChange, infantChange } =
		usePaxNumber();

	function setParentState() {
		adult = state.adult;
		infant = state.infant;
	}
</script>

{#snippet trigger(props: Record<string, unknown>)}
	{#if displaySelectedText({ adult, infant }) != ''}
		{#if variant == 'combination'}
			<Button
				variant="ghost"
				{...props}
				class={cn('block h-fit w-full space-y-1 border px-2 py-1 text-start', triggerClass)}
			>
				<p class="text-xs font-normal text-gray-500">Passenger</p>
				{#if displaySelectedText({ adult, infant }) != ''}
					<div class="flex justify-start gap-2">
						<div>
							<Icon icon="cuida:user-outline" class="text-primary" width="24" height="24" />
						</div>
						<div class="text truncate">{displaySelectedText({ adult, infant })}</div>
					</div>
				{/if}
			</Button>
		{:else}
			<Button
				variant="ghost"
				{...props}
				class={cn(
					'text-primary hover:text-primary flex justify-start px-2 font-semibold',
					triggerClass
				)}
				role="combobox"
			>
				{#if showIcon}
					<div class="">
						<Icon icon="cuida:user-outline" width="24" height="24" />
					</div>
				{/if}
				<div class="text truncate">{displaySelectedText({ adult, infant })}</div>
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
		<PaxNumberItem paxType="Adult" ageInfo="3++ years" value={state.adult} onChange={adultChange}>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:person" width="25" height="30" class="text-muted-foreground" />
			{/snippet}
		</PaxNumberItem>

		<PaxNumberItem
			paxType="Infant"
			ageInfo="Less than 3 years"
			value={state.infant}
			onChange={infantChange}
		>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:baby" width="23" height="23" class="text-muted-foreground" />
			{/snippet}
		</PaxNumberItem>

		<div class="space-x-3 text-right">
			{#if state.adult == 1 && state.infant == 0}
				<Button variant="ghost" disabled>Reset</Button>
			{:else}
				<Button variant="ghost" onclick={() => reset()}>Reset</Button>
			{/if}
			<Button onclick={() => closeAndFocusTrigger()} class="w-[120px]">Done</Button>
		</div>
	</Popover.Content>
</Popover.Root>
