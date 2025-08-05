<script>
	import * as Card from '$lib/components/ui/card';
	import Skeleton from '$lib/components/ui/skeleton/skeleton.svelte';
	import MFlightSkeletonCard from './m-flight-skeleton-card.svelte';
</script>

<div class="pt-4">
	<div class="space-y-2 px-2">
		{#each Array(8) as _}
			<MFlightSkeletonCard />
		{/each}
	</div>

	<div class="fixed bottom-0 w-full max-w-lg">
		<Card.Root class="rounded-none">
			<Card.Content class="w-full p-0">
				<div class="flex justify-around py-2">
					<Skeleton class="h-8 w-8" />
					<Skeleton class="h-8 w-8" />
					<Skeleton class="h-8 w-8" />
					<Skeleton class="h-8 w-8" />
					<Skeleton class="h-8 w-8" />
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</div>
