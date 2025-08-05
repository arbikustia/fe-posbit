<script lang="ts">
	import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "$lib/components/ui/drawer";

	// import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from '$lib/ui/drawer';
	let isOpen = false;
</script>

<div class="space-y-3">
	<h1 class="text-xl font-bold">Reviews</h1>

	<div class="rounded-md border p-3 shadow-xs space-y-3">
		<div class="flex w-full justify-between">
			<span>Overall rating 4/5</span>

			<!-- Trigger Drawer -->
			<Drawer>
				<DrawerTrigger>
					<span class="text-blue-500 text-xs font-bold cursor-pointer">See All</span>
				</DrawerTrigger>

				<DrawerContent class="p-5 space-y-4 w-screen h-screen max-w-none">

					<DrawerHeader>
						<DrawerTitle>All Reviews</DrawerTitle>
					</DrawerHeader>

					<!-- You can loop over a review list here -->
					<div class="space-y-4">
						{#each Array(5) as _, i}
							<div class="border p-2 space-y-2">
								<div class="text-xs flex justify-between">
									<span class="font-bold">Reviewer {i + 1} * * * * *</span>
									<span>{i + 1} week ago</span>
								</div>
								<p class="text-xs">
									Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, sit ipsa. Impedit alias...
								</p>
							</div>
						{/each}
					</div>
				</DrawerContent>
			</Drawer>
		</div>

		<!-- Two static reviews -->
		{#each [1, 2] as _, i}
			<div class="border p-2 space-y-2">
				<div class="text-xs flex justify-between">
					<span class="font-bold">AAA * * * * *</span>
					<span>1 week ago</span>
				</div>
				<p class="text-xs">
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quam, sit ipsa. Impedit alias...
				</p>
				<div class="w-full text-xs text-end text-blue-500">show more</div>
			</div>
		{/each}
	</div>
</div>
