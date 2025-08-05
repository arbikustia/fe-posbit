<script lang="ts">
	import * as Alert from '$lib/components/ui/alert';
	import { fly } from 'svelte/transition';
	let { show, title }: { show: boolean; title: string } = $props();
</script>

{#if show}
	<div transition:fly>
		<Alert.Root variant="destructive" class="validation-alert bg-destructive/10 p-2">
			<Alert.Title class="mb-0">{title}</Alert.Title>
		</Alert.Root>
	</div>
{/if}
