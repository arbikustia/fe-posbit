<script lang="ts">
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<div class="flex items-center justify-end border-b py-4 pl-4">
	<!-- AIRLINE LOGO + NAME -->
	<div class="mr-auto flex items-center gap-3">
		<div class="flex-0 w-[45px]">
			<Skeleton class="size-10 rounded-full" />
		</div>
		<div>
			<div class="text-sm">
				<Skeleton class="h-4 w-[100px]" />
			</div>
		</div>
	</div>

	<!-- DEPARTURE -> ARRIVAL -->
	<div class=" mr-5 flex items-center gap-3">
		<!-- ORIGIN -->
		<div class="flex w-[50px] flex-col items-center text-center leading-none">
			<div class="text-lg font-medium">
				<Skeleton class="size-6 w-[50px]" />
			</div>
			<div class="mt-1 text-muted-foreground">
				<Skeleton class="size-5 w-[40px]" />
			</div>
		</div>

		<!-- DURATION -->
		<div class="flex w-[100px] items-center justify-center text-center">
			<div class="w-[60px] text-sm text-muted-foreground">
				<div class="whitespace-nowrap">
					<Skeleton class="size-6 w-[60px]" />
				</div>
			</div>
		</div>

		<!-- DESTINATION -->
		<div class="flex w-[50px] flex-col items-center text-center leading-none">
			<div class="text-lg font-medium">
				<Skeleton class="size-6 w-[50px]" />
			</div>
			<div class="mt-1 text-muted-foreground">
				<Skeleton class="size-5 w-[40px]" />
			</div>
		</div>
	</div>

	<!-- SELECT PRICE -->
	<div class="ml-4 flex items-center">
		<Skeleton class="size-7 w-[150px]" />
		<Skeleton class="ml-4 mr-3 size-7 w-[60px]" />
		<Skeleton class="mr-3 size-6 w-6 rounded-full" />
	</div>
</div>
