<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import type { Snippet } from 'svelte';

	type PriceDetailCardProps = {
		title: string;
		subtitle?: string;
		children: Snippet;
	};

	let value = $state('price-detail');

	let { title, subtitle, children }: PriceDetailCardProps = $props();
</script>

<Card.Root class="overflow-hidden">
	<Card.Content class="p-0">
		<Accordion.Root type="single" bind:value>
			<Accordion.Item value="price-detail" class="border-0">
				<Accordion.Trigger class="px-4 text-base hover:bg-gray-100 hover:no-underline">
					<p>
						{title}
						{#if subtitle}
							- <span class="text-sm font-normal text-gray-500">{subtitle}</span>
						{/if}
					</p>
				</Accordion.Trigger>
				<Accordion.Content class="px-4">
					<div class="space-y-2">
						{@render children()}
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Card.Content>
</Card.Root>
