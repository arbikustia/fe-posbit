<script lang="ts">
	import { cn } from '$lib/utils';
	import { Tooltip } from 'bits-ui';
	import { fly } from 'svelte/transition';

	type SearchFormValidation = {
		open: boolean;
		message: string;
		target: HTMLElement;
		class?: string;
	};

	let { open, message, target, class: className }: SearchFormValidation = $props();
</script>

<Tooltip.Root bind:open={() => open, () => {}} delayDuration={0}>
	<Tooltip.Trigger class="hidden" />
	<Tooltip.Content
		forceMount
		class={cn('z-10 w-44 rounded-md bg-black p-2  text-center', className)}
		side="bottom"
		customAnchor={target}
	>
		{#snippet child({ wrapperProps, props, open })}
			{#if open}
				<div {...wrapperProps}>
					<div {...props} transition:fly={{ y: -10 }}>
						<Tooltip.Arrow />
						<p class="text-white">{message}</p>
					</div>
				</div>
			{/if}
		{/snippet}
	</Tooltip.Content>
</Tooltip.Root>
