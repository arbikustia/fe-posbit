<script lang="ts">
	import { cn } from '$lib/utils';
	import ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	type MAppBarProps = {
		leftAction?: Snippet;
		leftContent?: Snippet;
		rightContent?: Snippet;
	} & HTMLAttributes<HTMLDivElement>;

	let {
		leftAction,
		leftContent,
		rightContent,
		class: className,
		...props
	}: MAppBarProps = $props();
</script>

<div
	class={cn(
		'fixed top-0 z-10 flex h-16 w-full max-w-lg items-center justify-between gap-3 bg-white px-4 py-3 shadow-xs',
		className
	)}
	{...props}
>
	<div class="flex items-center gap-4">
		{#if leftAction !== undefined}
			{@render leftAction()}
		{:else}
			<button class="rounded-full border border-gray-300 p-1" onclick={() => history.back()}>
				<ChevronLeft class="h-5! w-5! " />
			</button>
		{/if}
		{@render leftContent?.()}
	</div>

	{@render rightContent?.()}
</div>
