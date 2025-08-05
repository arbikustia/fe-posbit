<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="mb-3 flex items-center justify-between">
	<Skeleton class="size-7 w-48" />
	<Skeleton class="size-7 w-48" />
</div>

<div class="grid grid-cols-12 gap-6">
	<div class="col-span-8 space-y-4">
		{#each Array(2)}
			<Card.Root>
				<Card.Header>
					<Skeleton class="size-7 w-36" />
				</Card.Header>
				<Card.Content class="space-y-4">
					<Skeleton class="size-4 w-full" />
					<Skeleton class="size-4 w-full" />
					<Skeleton class="size-4 w-full" />

					<Skeleton class="h-28 w-full" />
					<Skeleton class="h-28 w-full" />
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
	<div class="col-span-4 space-y-4">
		{#each Array(5)}
			<Card.Root>
				<Card.Header>
					<Skeleton class="size-7 w-36" />
				</Card.Header>
				<Card.Content class="space-y-4">
					<Skeleton class="size-4 w-full" />
					<Skeleton class="size-4 w-full" />
					<Skeleton class="size-4 w-full" />
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</div>
