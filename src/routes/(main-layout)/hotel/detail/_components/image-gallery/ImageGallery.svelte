<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	const imageData: any[] = [
		{ src: 'https://picsum.photos/id/1011/800/400', category: 'Rooms' },
		{ src: 'https://picsum.photos/id/1012/800/400', category: 'Rooms' },
		{ src: 'https://picsum.photos/id/1013/800/400', category: 'Facilities' },
		{ src: 'https://picsum.photos/id/1014/800/400', category: 'Facilities' },
		{ src: 'https://picsum.photos/id/1015/800/400', category: 'Restaurant' },
		{ src: 'https://picsum.photos/id/1016/800/400', category: 'Restaurant' }
	];

	let categories = ['All', 'Room', 'Facilities', 'Restaurant'];
	let selectedCategory = 'All';
	let selectedIndex = 0;

	$: filteredImages =
		selectedCategory === 'All'
			? imageData
			: imageData.filter((img) => img.category === selectedCategory);

	function prevImage() {
		selectedIndex = (selectedIndex - 1 + filteredImages.length) % filteredImages.length;
	}

	function nextImage() {
		selectedIndex = (selectedIndex + 1) % filteredImages.length;
	}
</script>

<Dialog.Root>
	<Dialog.Trigger
		class={cn(
			' col-span-1 row-span-1 flex items-center justify-center rounded bg-gray-500 text-sm text-white'
		)}
	>
		See {imageData.length}+<br />photos
	</Dialog.Trigger>

	<Dialog.Content class="max-h-[90vh] w-full overflow-hidden sm:max-w-3xl">
		<Dialog.Header>
			<Dialog.Title>Ibis Styles Bandung Grand Central</Dialog.Title>
			<Dialog.Description>All Photos</Dialog.Description>
		</Dialog.Header>

		<!-- Main Image Viewer -->
		<div
			class="relative flex h-[150px] items-center justify-center rounded-md bg-gray-100 sm:h-[250px]"
		>
			<img
				src={filteredImages[selectedIndex]?.src}
				alt="preview"
				class="max-h-full max-w-full object-contain"
			/>
			<button
				class="absolute left-3 top-1/2 w-7 h-7 flex justify-center items-center -translate-y-1/2 rounded-full bg-white p-1.5 shadow-sm"
				on:click={prevImage}
			>
				<Icon icon="weui:arrow-outlined" width="12" height="24" class="rotate-180" style="color: #7b7b7b" />
			</button>
			<button
				class="absolute right-3 top-1/2 w-7 h-7 flex justify-center items-center -translate-y-1/2 rounded-full bg-white p-1.5 shadow-sm"
				on:click={nextImage}
			>
				<Icon icon="weui:arrow-outlined" width="12" height="24" style="color: #7b7b7b" />
			</button>
		</div>

		<!-- Tabs -->
		<div class="flex gap-2 overflow-x-auto py-3 text-sm">
			{#each categories as cat}
				<button
					class="whitespace-nowrap rounded-full border px-3 py-1
              hover:bg-gray-200
              {selectedCategory === cat ? 'bg-gray-300' : ''}"
					on:click={() => {
						selectedCategory = cat;
						selectedIndex = 0;
					}}
				>
					{cat} ({cat === 'All'
						? imageData.length
						: imageData.filter((i) => i.category === cat).length})
				</button>
			{/each}
		</div>

		<!-- Thumbnails -->
		<div class="flex gap-2 overflow-x-auto pb-3">
			{#each filteredImages as img, i}
				<button
					type="button"
					on:click={() => (selectedIndex = i)}
					class="border-none bg-transparent p-0"
				>
					<img
						src={img.src}
						alt="thumb"
						class="h-16 w-16 rounded object-cover
						{selectedIndex === i ? 'border-2 border-blue-500' : 'border border-gray-200'}"
					/>
				</button>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
