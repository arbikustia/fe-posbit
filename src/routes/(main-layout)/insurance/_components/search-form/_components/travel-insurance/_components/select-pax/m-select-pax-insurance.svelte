<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Icon from '@iconify/svelte';
	import PaxNumberItem from './select-pax-item.svelte';
	import { useSelectPax } from './select-pax.svelte';

	let { adult = $bindable(), child = $bindable() } = $props();

	const { state, displaySelectedText, reset, closeAndFocusTrigger, adultChange, childChange } =
		useSelectPax();

	function setParentState() {
		adult = state.adult;
		child = state.child;
	}
</script>

<Drawer.Root bind:open={state.isOpenList}>
	<Drawer.Trigger
		bind:ref={state.triggerRef}
		class={buttonVariants({
			variant: 'ghost',
			class: 'block h-fit w-full px-0 text-start'
		})}
	>
		<p class="text-xs font-normal text-gray-500 mb-1">Traveler</p>
		{#if displaySelectedText({ adult, child }) != ''}
			<div class="flex justify-start gap-2">
				<div>
					<Icon icon="cuida:user-outline" class="text-primary" width="24" height="24" />
				</div>
				<div class="text truncate">{displaySelectedText({ adult, child })}</div>
			</div>
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

		<PaxNumberItem
			paxType="Child"
			ageInfo="2-11 years"
			value={state.child}
			onChange={childChange}
		>
			{#snippet iconPaxType()}
				<Icon icon="fa6-solid:child" width="23" height="23" class="text-muted-foreground" />
			{/snippet}
		</PaxNumberItem>

		<div class="flex gap-x-2">
			{#if state.adult == 1 && state.child == 0}
				<Button class="flex-1" variant="outline" disabled>Reset</Button>
			{:else}
				<Button class="flex-1" variant="outline" onclick={() => reset()}>Reset</Button>
			{/if}
			<Button class="flex-1" onclick={() => closeAndFocusTrigger()}>Done</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>
