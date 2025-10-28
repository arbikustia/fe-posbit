<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type FormCardProps = {
		title?: string;
		children: Snippet;
		subtitle?: string;
		class?: string;
	};

	let { title, children, subtitle, class: className }: FormCardProps = $props();
</script>

<Card.Root class="gap-0 overflow-hidden py-0 text-gray-700">
	{#if title}
		<Card.Header class="p-5! gap-0 border-b bg-gray-100 ">
			<Card.Title class="text-primary text-lg font-bold capitalize">
				{title}
			</Card.Title>
			{#if subtitle}
				<div class="text-sm">{subtitle}</div>
			{/if}
		</Card.Header>
	{/if}
	<Card.Content class={cn('space-y-1 p-4', className)}>{@render children()}</Card.Content>
</Card.Root>
