<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type FormCardProps = {
		title: string;
		children: Snippet;
	};

	let { title, children }: FormCardProps = $props();

	let accordionValue = $state('item-1');

	const isAccordionOpen = $derived(accordionValue !== '');
</script>

<Accordion.Root type="single" bind:value={accordionValue}>
	<Accordion.Item
		class={cn('overflow-hidden rounded-lg border-none bg-card', {
			'border shadow-sm': isAccordionOpen
		})}
		value="item-1"
	>
		<Accordion.Trigger
			class="border-b bg-primary/85 p-4 py-2 capitalize text-primary-foreground hover:no-underline [&>svg]:text-primary-foreground"
		>
			<h2 class="text-lg">{title}</h2>
		</Accordion.Trigger>
		<Accordion.Content class="p-0">
			{@render children()}
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
