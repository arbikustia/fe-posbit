<script lang="ts">
	import * as Popover from '$lib/components/ui/popover';
	import type { Snippet } from 'svelte';

	type OtherActionProps = {
		triggerContent: Snippet;
		triggerClass?: string;
		actions: Snippet;
	};

	let { triggerContent, triggerClass, actions }: OtherActionProps = $props();
</script>

<Popover.Root>
	<Popover.Trigger class={triggerClass}>{@render triggerContent()}</Popover.Trigger>
	<Popover.Content align="start" class="w-fit min-w-36 p-0 px-2">
		{@render actions()}
	</Popover.Content>
</Popover.Root>
