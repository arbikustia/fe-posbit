<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';

	let isOpen = false;

	// Price range state
	let minPrice = 0;
	let maxPrice = 16000000;

	// Format currency helper
	const formatCurrency = (value: number) => {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR',
			minimumFractionDigits: 0
		})
			.format(value)
			.replace('IDR', '')
			.trim();
	};
</script>

<!-- Drawer Component -->
<Drawer.Root open={isOpen} onOpenChange={(val) => (isOpen = val)}>
	<Drawer.Trigger>
		<Button
			variant="default"
			class="flex w-fit items-center justify-between gap-5 rounded-md px-5 py-2 text-white"
		>
			<span class="font-bold">Price</span>
			<Icon icon="simple-line-icons:arrow-down" width="15" height="15" style="color: #fff" />
		</Button>
	</Drawer.Trigger>
	<Drawer.Portal>
		<Drawer.Content
			class="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] rounded-t-lg bg-white p-6 shadow-xl"
		>
			<div class="space-y-6">
				<!-- Header -->
				<div class="flex items-center justify-between">
					<h2 class="text-xl font-bold text-gray-800">Price Range</h2>
					<button on:click={() => (isOpen = false)} class="text-gray-500 hover:text-gray-700">
						<Icon icon="mdi:close" width="24" height="24" />
					</button>
				</div>

				<!-- Description -->
				<p class="text-sm text-gray-600">Price per room per night</p>

				<!-- Price Inputs -->
				<div class="grid grid-cols-2 gap-4">
					<div>
						<span class="mb-1 block text-sm font-medium text-gray-700">Min.</span>
						<div class="shadow-xs relative rounded-md">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<span class="text-gray-500 sm:text-sm">IDR</span>
							</div>
							<input
								type="number"
								bind:value={minPrice}
								class="focus:outline-hidden block w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 focus:border-blue-500 focus:ring-blue-500"
								min="0"
							/>
						</div>
					</div>

					<div>
						<span class="mb-1 block text-sm font-medium text-gray-700">Max</span>
						<div class="shadow-xs relative rounded-md">
							<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
								<span class="text-gray-500 sm:text-sm">IDR</span>
							</div>
							<input
								type="number"
								bind:value={maxPrice}
								class="focus:outline-hidden block w-full rounded-md border border-gray-300 py-2 pl-12 pr-3 focus:border-blue-500 focus:ring-blue-500"
								min="0"
							/>
						</div>
					</div>
				</div>

				<!-- Current Max Price Display -->
				<div class="text-center text-sm text-gray-600">
					Current max: {formatCurrency(maxPrice)}
				</div>
			</div>

			<!-- Footer Buttons -->
			<div class="mt-8 flex justify-between border-t pt-4">
				<button
					class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
					on:click={() => (isOpen = false)}
				>
					Cancel
				</button>

				<div class="flex gap-2">
					<button
						class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
						on:click={() => {
							minPrice = 0;
							maxPrice = 16000000;
						}}
					>
						Reset
					</button>
					<button
						class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						on:click={() => {
							// Apply price range filter logic here
							console.log('Price range selected:', minPrice, 'to', maxPrice);
							isOpen = false;
						}}
					>
						Done
					</button>
				</div>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
