<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Icon from '@iconify/svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import PaxNumberItem from './pax-number-item.svelte';
	import { usePaxNumber } from './pax-number.svelte.js';

	let { adult = $bindable(), child = $bindable(), infant = $bindable() } = $props();

	const {
		state,
		displaySelectedText,
		reset,
		closeAndFocusTrigger,
		adultChange,
		childChange,
		infantChange
	} = usePaxNumber();

	function setParentState() {
		adult = state.adult;
		child = state.child;
		infant = state.infant;
	}
</script>

<Drawer.Root bind:open={state.isOpenList}>
	<Drawer.Trigger
		bind:ref={state.triggerRef}
		class={buttonVariants({
			variant: 'ghost',
			class: 'bg-accent flex h-11 w-full justify-start px-2'
		})}
	>
		{#if displaySelectedText({ adult, child, infant }) != ''}
			<div>
				<Icon icon="cuida:user-outline" width="24" height="24" />
			</div>
			<div class="text truncate">{displaySelectedText({ adult, child, infant })}</div>
			<ChevronDown class="ml-auto size-4 shrink-0" />
		{/if}
	</Drawer.Trigger>
	<Drawer.Content
		class="space-y-6 px-2 pb-2"
		onCloseAutoFocus={(e) => {
			e.preventDefault();
			setParentState();
		}}
	>
		<PaxNumberItem paxType="Adult" ageInfo="12++ years" value={state.adult} onChange={adultChange}>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:person" width="25" height="30" class="text-muted-foreground" />
			{/snippet}
		</PaxNumberItem>

		<PaxNumberItem paxType="Child" value={state.child} ageInfo="2-11 years" onChange={childChange}>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:child" width="25" height="25" class="text-muted-foreground" />
			{/snippet}
		</PaxNumberItem>

		<PaxNumberItem
			paxType="Infant"
			ageInfo="Less than 2 years"
			value={state.infant}
			onChange={infantChange}
		>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:baby" width="23" height="23" class="text-muted-foreground" />
			{/snippet}
		</PaxNumberItem>

		<div class="flex gap-x-2">
			{#if state.adult == 1 && state.child == 0 && state.infant == 0}
				<Button class="flex-1" variant="outline" disabled>Reset</Button>
			{:else}
				<Button class="flex-1" variant="outline" onclick={() => reset()}>Reset</Button>
			{/if}
			<Button class="flex-1" onclick={() => closeAndFocusTrigger()}>Done</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
