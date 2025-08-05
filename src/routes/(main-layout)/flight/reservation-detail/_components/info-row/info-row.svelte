<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type InfoRowProps = {
		label: string;
		highlighted?: boolean;
		children: Snippet;
	};
	let { label, highlighted, children }: InfoRowProps = $props();
</script>

<div
	class={cn('grid grid-cols-3 p-2 px-4', {
		'bg-gray-100': highlighted
	})}
>
	<div>{label}</div>

	<!-- more col -->
	{@render children?.()}
</div>
