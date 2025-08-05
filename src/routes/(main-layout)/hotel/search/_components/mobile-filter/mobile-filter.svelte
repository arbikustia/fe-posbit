<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';

	let isOpen = false;

	// State untuk filter
	let freeCancellation = false;
	let facilities = {
		breakfast: true,
		fullboard: true,
		nonSmoking: true
	};
	let popularAreas = {
		asiaAfrika: false,
		dago: false,
		riau: false,
		lembang: false,
		ciumbuleuit: false
	};
	let priceRange = {
		min: 0,
		max: 16000000
	};
</script>

<!-- Drawer Component -->
<Drawer.Root open={isOpen} onOpenChange={(val) => (isOpen = val)}>
	<Drawer.Trigger>
		<Icon icon="mage:filter" width="20" height="20" style="color: #2b44d7" />
		<span class="text-blue-500 text-xs">Filter</span>
	</Drawer.Trigger>

	<Drawer.Portal>
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] rounded-t-lg bg-white p-6 shadow-xl"
		>
			<div class="space-y-6">
				<!-- Header -->
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold text-gray-800">Star Rating</h2>
					<button on:click={() => (isOpen = false)} class="text-gray-500 hover:text-gray-700">
						<Icon icon="mdi:close" width="24" height="24" />
					</button>
				</div>

				<!-- Cancellation Option -->
				<div>
					<h3 class="mb-3 font-medium text-gray-700">Cancellation Option</h3>
					<label class="flex items-center gap-3">
						<input
							type="checkbox"
							bind:checked={freeCancellation}
							class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
						/>
						<span class="text-gray-700">Free cancellation property</span>
					</label>
				</div>

				<!-- Facilities -->
				<div>
					<h3 class="mb-3 font-medium text-gray-700">Facilities</h3>
					<div class="space-y-2">
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={facilities.breakfast}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Includes breakfast</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={facilities.fullboard}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Includes fullboard</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={facilities.nonSmoking}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Non-smoking</span>
						</label>
					</div>
				</div>

				<!-- Popular Area -->
				<div>
					<h3 class="mb-3 font-medium text-gray-700">Popular Area</h3>
					<div class="grid grid-cols-2 gap-2">
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={popularAreas.asiaAfrika}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Asia Afrika</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={popularAreas.dago}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Dago</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={popularAreas.riau}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Riau</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={popularAreas.lembang}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Lembang</span>
						</label>
						<label class="flex items-center gap-3">
							<input
								type="checkbox"
								bind:checked={popularAreas.ciumbuleuit}
								class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">Ciumbuleuit</span>
						</label>
					</div>
				</div>

				<!-- Price Range -->
				<div>
					<h3 class="mb-3 font-medium text-gray-700">Price Range</h3>
					<p class="mb-2 text-sm text-gray-600">Price per room per night</p>
					<div class="flex items-center gap-4">
						<div class="flex-1">
							<span class="block text-sm font-medium text-gray-700">Min. IDR</span>
							<input
								type="number"
								bind:value={priceRange.min}
								class="mt-1 w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
						<div class="flex-1">
							<span class="block text-sm font-medium text-gray-700">Max IDR</span>
							<input
								type="number"
								bind:value={priceRange.max}
								class="mt-1 w-full rounded-md border-gray-300 shadow-xs focus:border-blue-500 focus:ring-blue-500"
							/>
						</div>
					</div>
				</div>
			</div>

			<!-- Footer Buttons -->
			<div class="mt-8 flex justify-end gap-3">
				<button
					class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					on:click={() => {
						// Reset semua filter
						freeCancellation = false;
						facilities = {
							breakfast: false,
							fullboard: false,
							nonSmoking: false
						};
						popularAreas = {
							asiaAfrika: false,
							dago: false,
							riau: false,
							lembang: false,
							ciumbuleuit: false
						};
						priceRange = { min: 0, max: 16000000 };
					}}
				>
					Reset
				</button>
				<button
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					on:click={() => {
						// Logic untuk apply filter
						isOpen = false;
					}}
				>
					Apply Filters
				</button>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
