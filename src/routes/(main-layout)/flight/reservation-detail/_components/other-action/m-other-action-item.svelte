<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { OtherActionItemProps } from './types';

	let { icon, label, onClick }: OtherActionItemProps = $props();
</script>

<button onclick={onClick} class="w-full py-2">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-x-2">
			{@render icon()}
			{label}
		</div>
		<ChevronRight class="text-primary" />
	</div>
</button>
