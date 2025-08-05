<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type FormCardProps = {
		title?: string;
		children: Snippet;
		header?: Snippet;
	};

	let { title, children, header }: FormCardProps = $props();

	let accordionValue = $state('item-1');

	const isAccordionOpen = $derived(accordionValue !== '');
</script>

<Accordion.Root type="single" bind:value={accordionValue}>
	<Accordion.Item
		class={cn('bg-card overflow-hidden rounded-lg border-none', {
			'border shadow-sm': isAccordionOpen
		})}
		value="item-1"
	>
		<Accordion.Trigger
			class={cn(
				'bg-primary/85 text-primary-foreground [&>svg]:text-primary-foreground items-center border-b p-4 py-2 capitalize hover:no-underline',
				{
					'rounded-b-none': isAccordionOpen
				}
			)}
		>
			{#if header}
				{@render header()}
			{:else}
				<h2 class="text-lg">{title}</h2>
			{/if}
		</Accordion.Trigger>
		<Accordion.Content class="p-0">
			{@render children()}
		</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
