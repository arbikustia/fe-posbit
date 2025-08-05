<script lang="ts">
	import { SearchField } from '$lib/components/opsigo-ui/input';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';

	let {
		searchQuery = $bindable(''),
		showHideAll,
		reset
	}: { searchQuery: string; showHideAll: (val: boolean) => void; reset: () => void } = $props();
</script>

<div class="mt-2 flex items-center gap-2">
	<SearchField bind:value={searchQuery} placeholder="Search columns..." className="flex-auto" />
	<Button size="sm" variant="outline" onclick={() => showHideAll(true)}>
		<Icon icon="lucide:eye" />
		Show All
	</Button>
	<Button size="sm" variant="outline" onclick={() => showHideAll(false)}>
		<Icon icon="uil:eye-slash" />
		Hide All
	</Button>
	<Button size="sm" variant="outline" onclick={() => reset()}>
		<Icon icon="ri:reset-left-fill" />
		Reset
	</Button>
</div>
