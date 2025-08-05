<script lang="ts">
	import type { WithElementRef } from '$lib/utils';
	import type { SVGAttributes } from 'svelte/elements';

	let { ...props }: WithElementRef<SVGAttributes<SVGElement>> = $props();
</script>

<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...props}>
	<path
		fill="none"
		stroke="currentColor"
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="1.5"
		d="M5 20v-1a7 7 0 0 1 7-7v0a7 7 0 0 1 7 7v1m-7-8a4 4 0 1 0 0-8a4 4 0 0 0 0 8"
	/>
</svg>
