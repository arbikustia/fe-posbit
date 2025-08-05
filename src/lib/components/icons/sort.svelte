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
		stroke-width="1.5"
		d="M22 7H2m17 5H5m11 5H8"
	/>
</svg>
