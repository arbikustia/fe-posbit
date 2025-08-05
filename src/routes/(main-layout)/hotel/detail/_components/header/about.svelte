<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';
	import { ImageGallery } from '../image-gallery';
</script>

<Card.Root>
	<Card.Content>
		<div class="flex items-center justify-center gap-5">
			<div class="flex w-[60%] flex-col gap-3">
				<h1 class="text-2xl font-bold">The 101 Bandung</h1>
				<div class="flex flex-col">
					<span class="flex">
						<Icon
							icon="material-symbols-light:star"
							width="20"
							height="20"
							style="color: #e2e116"
						/>
						<Icon
							icon="material-symbols-light:star"
							width="20"
							height="20"
							style="color: #e2e116"
						/>
						<Icon
							icon="material-symbols-light:star"
							width="20"
							height="20"
							style="color: #e2e116"
						/>
						<Icon
							icon="material-symbols-light:star"
							width="20"
							height="20"
							style="color: #e2e116"
						/>
						<Icon
							icon="material-symbols-light:star"
							width="20"
							height="20"
							style="color: #e2e116"
						/>
					</span>
					<span class="text-sm">review rating 4/5</span>
				</div>
				<div class="flex flex-col">
					<p class="text-lg font-bold">Description</p>
					<p class="text-md">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo nihil beatae atque iusto
						est qui assumenda deleniti suscipit voluptas perferendis dolor magni, recusandae
						officiis saepe tempora, possimus consequuntur aliquid corporis!
					</p>
				</div>
				<div class="grid grid-cols-3">
					<div class="flex flex-col">
						<span class="text-md font-bold">Phone</span>
						<span class="text-sm">09876543</span>
					</div>
					<div class="flex flex-col">
						<span class="text-md font-bold">Email</span>
						<span class="text-sm">Email@gmail.com</span>
					</div>
					<div class="flex flex-col">
						<span class="text-md font-bold">Website</span>
						<span class="text-sm">Website.com</span>
					</div>
				</div>
			</div>
			<div class="grid h-[150px] w-[40%] grid-cols-4 grid-rows-2 gap-2">
				<!-- Kolom 1 dan 2 (gabung) -->
				<div class="col-span-2 row-span-2 rounded bg-gray-200"></div>

				<!-- Kolom 3 -->
				<div class="col-span-1 row-span-1 rounded bg-gray-200"></div>
				<div class="col-span-1 row-span-1 rounded bg-gray-200"></div>

				<!-- Baris terakhir -->
				<div class="col-span-1 row-span-1 rounded bg-gray-200"></div>
				<ImageGallery />
			</div>
		</div>
	</Card.Content>
</Card.Root>
