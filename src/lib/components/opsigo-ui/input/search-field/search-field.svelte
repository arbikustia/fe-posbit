<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import Icon from '@iconify/svelte';

	let { value = $bindable(''), className = '', placeholder = 'Search' } = $props();
</script>

<div class={['relative', className]}>
	<Icon
		icon="iconamoon:search-bold"
		class="absolute top-1/2 left-3 -translate-y-1/2 text-xl text-gray-400"
	/>
	<Input {placeholder} bind:value class="pl-10" />
</div>
