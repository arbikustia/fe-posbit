<script lang="ts">
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	const { className = '' } = $props();
</script>

<a href="javascript:void(0)" onclick={() => goto('/deposit')} class={cn('card-balance', className)}>
	<Icon icon="uit:wallet" class="text-xl" />
	<p class="label">Deposit:</p>
	<p class="value">123,000 IDR</p>
</a>

<style>
	@reference '$appCss';
	.card-balance {
		@apply m-2 flex cursor-pointer items-center gap-2 rounded-md border p-2 shadow-lg;
	}
	.card-balance > .label {
		@apply text-sm font-medium;
	}
	.card-balance > .value {
		@apply flex-auto text-right text-sm font-medium;
	}
</style>
