<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Card from '$lib/components/ui/card/index';
	import FlightSkeletonCard from './flight-skeleton-card.svelte';
</script>

<div class="mt-10 flex gap-3">
	<div class="mb-4 flex items-center gap-3">
		<Skeleton class="size-10 " />
		<div>
			<div class="flex items-center">
				<div class="text-lg font-semibold"><Skeleton class="size-7 w-[350px]" /></div>
			</div>
			<div class="flex text-sm text-muted-foreground">
				<div class="mr-2 mt-1"><Skeleton class="size-5 w-[100px]" /></div>
			</div>
		</div>
	</div>
</div>

<div class="flex items-start gap-6">
	<div class="flex-1">
		<div class="mb-4 flex items-center gap-3">
			<Skeleton class="size-7 w-[45px]" />
			<Skeleton class="size-7 w-[83px]" />
			<Skeleton class="size-7 w-[83px]" />
			<Skeleton class="size-7 w-[83px]" />

			<div class="ml-auto">
				<Skeleton class="size-7 w-[83px]" />
			</div>
		</div>

		<div>
			<div>
				<Card.Root>
					<Card.Content class="p-0">
						<FlightSkeletonCard />
						<FlightSkeletonCard />
						<FlightSkeletonCard />
						<FlightSkeletonCard />
						<FlightSkeletonCard />
						<FlightSkeletonCard />
						<FlightSkeletonCard />
					</Card.Content>
				</Card.Root>
			</div>
		</div>
	</div>

	<!-- Kolom kedua yang mengambil sisa ruang -->
	<div class="w-[350px]"></div>
</div>
