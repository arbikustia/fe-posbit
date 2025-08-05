<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import type { FlightAncillaryProps } from './types';

	let { title, iconSrc, actionTitle, action, summaryContent }: FlightAncillaryProps = $props();
</script>

<Card.Root class="py-0">
	<Card.Content class="p-4">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-x-4">
				<img class="h-10" src={iconSrc} alt="Flight Ancillary Icon" />
				<span class="text-lg font-semibold">{title}</span>
			</div>

			<Button
				onclick={action}
				variant="outline"
				class="text-primary hover:text-primary w-36"
				size="sm"
			>
				{actionTitle}
			</Button>
		</div>
		{@render summaryContent?.()}
	</Card.Content>
</Card.Root>
