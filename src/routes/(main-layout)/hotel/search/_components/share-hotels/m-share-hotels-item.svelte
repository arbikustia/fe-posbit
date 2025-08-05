<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type MShareHotelItemProps = {
		icon: Snippet;
		label: string;
		onclick: () => void;
	};

	let { icon, label, onclick }: MShareHotelItemProps = $props();
</script>

<button {onclick} class="w-full py-2">
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-x-2">
			{@render icon()}
			{label}
		</div>
		<ChevronRight class="text-primary" />
	</div>
</button>