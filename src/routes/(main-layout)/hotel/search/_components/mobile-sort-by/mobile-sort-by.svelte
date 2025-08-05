<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';

	let isOpen = false;

	// State untuk sorting
	let sortOption = '';

	// Opsi sorting
	const sortOptions = [
		{ id: 'price_low_high', label: 'Price Low to High' },
		{ id: 'price_high_low', label: 'Price High to Low' },
		{ id: 'name_a_z', label: 'Hotel Name A-Z' },
		{ id: 'name_z_a', label: 'Hotel Name Z-A' },
		{ id: 'rating_high_low', label: 'Review Rating High to Low' },
		{ id: 'distance_near', label: 'Nearest Distance from City Center' }
	];
</script>

<!-- Drawer Component -->
<Drawer.Root open={isOpen} onOpenChange={(val) => (isOpen = val)}>
	<Drawer.Trigger>
		<Icon icon="mdi:sort" width="20" height="20" style="color: #2b44d7" />
		<span class="text-blue-500 text-xs">Sort</span>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] rounded-t-lg bg-white p-6 shadow-xl"
		>
			<div class="space-y-6">
				<!-- Header -->
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold text-gray-800">Sort by</h2>
					<button on:click={() => (isOpen = false)} class="text-gray-500 hover:text-gray-700">
						<Icon icon="mdi:close" width="24" height="24" />
					</button>
				</div>

				<!-- Sorting Options -->
				<div class="space-y-3">
					{#each sortOptions as option}
						<label class="flex items-center gap-3 rounded p-2 hover:bg-gray-50">
							<input
								type="radio"
								name="sortOptions"
								value={option.id}
								bind:group={sortOption}
								class="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
							/>
							<span class="text-gray-700">{option.label}</span>
						</label>
					{/each}
				</div>
			</div>

			<!-- Footer Buttons -->
			<div class="mt-8 flex justify-between border-t pt-4">
				<button
					class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					on:click={() => {
						sortOption = '';
						isOpen = false;
					}}
				>
					Cancel
				</button>
				<button
					class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					on:click={() => {
						// Logic untuk apply sorting
						console.log('Selected sort:', sortOption);
						isOpen = false;
					}}
				>
					Done
				</button>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
