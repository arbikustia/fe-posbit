<script>
	import { Skeleton } from '$lib/components/ui/skeleton';
</script>

<div
	class="fixed top-0 z-10 flex w-full max-w-lg items-center justify-between bg-white px-4 py-3 shadow-xs"
>
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
