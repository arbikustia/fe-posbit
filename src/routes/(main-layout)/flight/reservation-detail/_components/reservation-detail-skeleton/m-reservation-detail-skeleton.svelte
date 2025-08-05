<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div class="h-svh overflow-hidden">
	<div class="flex w-full max-w-lg items-center justify-between bg-white px-4 py-3 shadow-xs">
		<div class="flex h-10 w-full items-center justify-between">
			<div class="flex items-center gap-4">
				<Skeleton class="h-8 w-8 rounded-full" />
				<div class="space-y-2">
					<Skeleton class="h-4 w-40" />
					<Skeleton class="h-2 w-48" />
				</div>
			</div>
			<Skeleton class="h-8 w-20" />
		</div>
	</div>

	<div class="mt-6 space-y-4">
		<Card.Root>
			<Card.Content class="space-y-4">
				<Skeleton class="size-4 w-full" />
				<Skeleton class="size-4 w-full" />
				<Skeleton class="size-4 w-full" />
			</Card.Content>
		</Card.Root>

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
</div>
