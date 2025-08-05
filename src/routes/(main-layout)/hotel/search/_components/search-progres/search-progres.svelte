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
	<div class="pt-5" transition:slide>
		<Progress value={$progressPercent.percent} />
		<div class="mt-1 text-center text-muted-foreground">
			<div class="flex items-center justify-center">
				{#if $progressPercent.percent < 100}
					<LoaderCircle class="animate-spin" />
					<div>
						Searching for Hotels ... {$progressPercent.percent} %
					</div>
				{:else}
					<div>Search completed</div>
				{/if}
			</div>
		</div>
	</div>
{/if}
