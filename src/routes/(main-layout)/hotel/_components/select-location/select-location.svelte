<script lang="ts">
	import { OSGSelectAirport } from '$lib/components/opsigo-ui/select-airport';
	import { useSearchForm } from '../../../flight/_components/search-form/search-form.svelte.js';
	import type { Route } from '$lib/types/SearchFlightParam';
	import Icon from '@iconify/svelte';

	let { route = $bindable(), title }: any = $props();
</script>

<div class="flex w-full flex-col space-y-1 ">
	<span class="text-xs text-gray-700">{title}</span>

	<div class="border rounded-md border-gray-300">
		<OSGSelectAirport placeholder="Origin" bind:value={route.origin}>
			{#snippet icon()}
				<Icon icon="lucide:hotel" width="24" height="24" />
			{/snippet}
		</OSGSelectAirport>
	</div>
</div>
