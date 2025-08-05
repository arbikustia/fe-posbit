<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import type { Snippet } from 'svelte';

	type Props = {
		rightAction?: Snippet;
		headAction: Snippet;
		children: Snippet;
	};

	const { rightAction, headAction, children }: Props = $props();
</script>

<div class="container">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h3 class="text-2xl font-bold text-gray-800">Manage Articles</h3>
			<p class=" text-gray-500">Write, edit, and publish article</p>
		</div>
		{#if rightAction !== undefined}
			{@render rightAction()}
		{/if}
	</div>

	<Card.Root class="@container/card px-6">
		<Card.Header class="flex items-center justify-between px-2">
			{@render headAction()}
		</Card.Header>
		<Card.Content class="px-2 pt-0">
			{@render children()}
		</Card.Content>
	</Card.Root>
</div>
