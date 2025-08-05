<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { ChevronRight } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type MShareScheduleItemProps = {
		icon: Snippet;
		label: string;
		onclick: () => void;
	};

	let { icon, label, onclick }: MShareScheduleItemProps = $props();
</script>

<Button
	variant="ghost"
	{onclick}
	class="flex w-full items-center justify-between p-0 px-2 text-start"
>
	<div class="flex items-center gap-x-2">
		{@render icon()}
		{label}
	</div>
	<ChevronRight class="h-6! w-6! text-primary" />
</Button>
