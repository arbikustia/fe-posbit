<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<Card.Root>
	<Card.Content class="p-2">
		<div class="flex justify-between">
			<div class="space-y-2">
				<Skeleton class="h-8 w-8 rounded-sm" />
				<div class="space-y-1">
					<Skeleton class="h-3 w-40 rounded-sm" />
					<Skeleton class="h-3 w-40 rounded-sm" />
				</div>
			</div>
			<div class="relative flex items-center">
				<Skeleton class="h-6 w-32 rounded-sm" />
				<div class="absolute bottom-1 w-full">
					<Skeleton class="m-auto h-2 w-20 self-center rounded-sm" />
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
