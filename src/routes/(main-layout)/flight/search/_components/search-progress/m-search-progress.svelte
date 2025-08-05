<script lang="ts">
	import { Progress } from '$lib/components/ui/progress/index.js';
	import { progressPercent } from '$lib/stores/flightStore';
	import { slide } from 'svelte/transition';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	let isLoading = $state(false);
	let unsubscribe = progressPercent.subscribe((t) => {
		if (t.isLoading == false) {
			setTimeout(() => {
				isLoading = false;
			}, 1000);
		} else {
			isLoading = true;
		}
	});
</script>

{#if isLoading}
	<Progress class="h-1 rounded-none" value={$progressPercent.percent} />
{/if}
