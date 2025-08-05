<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	type TripSummarySegmentLabelProps = {
		label: number | string;
		labelType?: 'number' | 'text';
		isActive?: boolean;
		showDetailAction?: boolean;
		onDetailActionClick?: () => void;
	};

	let {
		label,
		labelType = 'number',
		isActive = true,
		showDetailAction,
		onDetailActionClick
	}: TripSummarySegmentLabelProps = $props();
</script>

<div class="flex items-center justify-between">
	<div class=" flex items-center gap-3">
		<div
			class={cn('flex items-center justify-center rounded-full bg-gray-200 text-center', {
				'bg-primary/70 text-primary-foreground': isActive,
				'h-7 w-7 font-semibold': labelType === 'number',
				'px-2 text-sm': labelType === 'text'
			})}
		>
			{label}
		</div>

		<div>Sun, 18 May 2025</div>
	</div>

	{#if showDetailAction}
		<Button variant="link" class="h-fit p-0 hover:no-underline" onclick={onDetailActionClick}>
			Detail
		</Button>
	{/if}
</div>
