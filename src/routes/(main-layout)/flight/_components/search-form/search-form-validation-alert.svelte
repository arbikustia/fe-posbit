<script lang="ts">
	import { cn } from '$lib/utils';
	import { type WithChildren } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	type ValidationAlertProps = {
		show: boolean;
	} & WithChildren<HTMLAttributes<HTMLDivElement>>;

	let { children, show, class: className }: ValidationAlertProps = $props();
</script>

{#if show}
	<div class="relative" transition:fly={{ y: -10 }}>
		<div
			class={cn(
				'absolute top-3 z-50 w-44 break-normal rounded-lg bg-black p-2 text-center text-white',
				className
			)}
		>
			{@render children?.()}
			<div
				class="absolute -top-2 left-1/2 h-0 w-0 -translate-x-1/2 rotate-180 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black"
			></div>
		</div>
	</div>
{/if}
