<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
</script>

<div class="mx-auto flex max-w-7xl p-4">
	<div>
		<div class="mb-6 flex flex-col items-start justify-start gap-5">
			<div class="flex flex-col items-start gap-4">
				<Skeleton class="h-5 w-32 rounded-md" />
				<Skeleton class="w-68 h-44 rounded-md" />
			</div>
			<div class="flex items-center gap-4">
				<Skeleton class="h-10 w-24 rounded-md" />
				<Skeleton class="h-10 w-32 rounded-md" />
			</div>
		</div>

		<div class="flex gap-6">
			<div class="w-72 space-y-6">
				<div class="space-y-3">
					<Skeleton class="h-5 w-24" />
					<div class="flex gap-3">
						{#each Array(5) as _, i}
							<Skeleton class="h-6 w-6 rounded-full" /> 
						{/each}
					</div>
				</div>

				<div class="space-y-3">
					<Skeleton class="h-5 w-48" />
					<div class="flex items-center gap-2">
						<Skeleton class="h-5 w-5 rounded-sm" />
						<Skeleton class="h-5 w-40" />
					</div>
				</div>

				<div class="space-y-3">
					<Skeleton class="h-5 w-24" />
					<div class="space-y-2">
						{#each Array(3) as _, i}
							<div class="flex items-center gap-2">
								<Skeleton class="h-5 w-5 rounded-sm" />
								<Skeleton class="h-5 w-32" />
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="flex-1">
		<div class="mb-4 flex items-center justify-between">
			<Skeleton class="h-7 w-48 rounded-md" />
			<div class="flex items-center gap-4">
				<Skeleton class="h-6 w-20" />
				<Skeleton class="h-6 w-20" />
				<Skeleton class="h-6 w-40" />
			</div>
		</div>

		<div class="mb-6 flex gap-4 overflow-x-auto pb-2">
			{#each Array(8) as _, i}
				<div class="flex min-w-[100px] flex-col items-center rounded-md border border-gray-200 p-3">
					<Skeleton class="mb-1 h-5 w-12" />
					<Skeleton class="h-6 w-20" />
				</div>
			{/each}
		</div>

		<!-- Hotel Cards -->
		<div class="space-y-6">
			{#each Array(3) as _, i}
				<div class="flex justify-between gap-5 rounded-lg border p-5">
					<div class="flex gap-5">
						<Skeleton class=" h-44 w-64" />

						<div class="mb-4 flex flex-col justify-between">
							<div>
								<Skeleton class="mb-1 h-7 w-40" />
								<div class="flex items-center gap-1">
									{#each Array(5) as _, i}
										<Skeleton class="h-3 w-3 rounded-full" /> <!-- Star ratings -->
									{/each}
								</div>
								<Skeleton class="mt-1 h-3 w-48" />
								<Skeleton class="mt-1 h-3 w-48" />
							</div>
							<Skeleton class="mt-1 h-3 w-48" />
						</div>
					</div>
					<div class="mb-4 space-y-2 flex flex-col justify-between">
						<div class="flex flex-col items-center gap-2">
							<Skeleton class="h-7 w-48" />
							<Skeleton class="h-4 w-48" />
							<Skeleton class="h-4 w-48" />
						</div>
						<div class="flex flex-col items-end gap-2">
							<Skeleton class="h-4 w-32" />
							<Skeleton class="h-7 w-32" />
						</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</div>
