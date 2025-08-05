<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { useFilterTime } from './filter-time.svelte.js';

	const { state } = useFilterTime();
</script>

<Popover.Root bind:open={state.open}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class=" justify-between"
				{...props}
				role="combobox"
				aria-expanded={state.open}
				title="Sort"
			>
				Time
				<ChevronDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-80 p-4" align="start">
		<div class="flex flex-col gap-y-6">
			<section>
				<h3 class="mb-3 text-base font-semibold">Time</h3>
			</section>
		</div>

		<div class="mt-6 flex justify-between pr-3">
			<Button variant="ghost">Reset</Button>
			<Button>Done</Button>
		</div>
	</Popover.Content>
</Popover.Root>
