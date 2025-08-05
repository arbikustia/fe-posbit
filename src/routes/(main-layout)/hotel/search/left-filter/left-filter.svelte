<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { Slider } from '$lib/components/ui/slider/index.js';
	import Icon from '@iconify/svelte';
	import { selectedStars } from '../_components/content-display/content-display.svelte.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { GoogleMaps } from '../_components/google-maps/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	// Reactive state
	let value = $state([25, 75]);
	let animationState = $state({
		mapScale: 1, // Start slightly zoomed in
		iconOpacity: 0, // Start invisible
		textScale: 1.2, // Start invisible
		iconScale: 6, // Start larger
		buttonOpacity: 0 // Start invisible
	});

	$effect(() => {
		// Trigger animations on mount
		const timer = setTimeout(() => {
			// Animate map zoom (scale from 1.1 to 1.0)
			animateProperty('mapScale', 3, 1200); // Longer duration for smoother effect

			// Animate icon (fade in and scale down)
			animateProperty('iconOpacity', 1, 600, 200); // Slight delay
			animateProperty('iconScale', 3, 800); // Slower scale down
			animateProperty('textScale', 1, 800); // Slower scale down

			// Animate button (fade in)
			animateProperty('buttonOpacity', 1, 500, 400); // Longer delay
		}, 50);

		return () => clearTimeout(timer);
	});

	function animateProperty(
		property: keyof typeof animationState,
		target: number,
		duration: number,
		delay = 0
	) {
		const startTime = Date.now() + delay;
		const startValue = animationState[property];
		const delta = target - startValue;

		function update() {
			const now = Date.now();
			if (now < startTime) {
				requestAnimationFrame(update);
				return;
			}

			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);

			// Smooth easing function (easeOutCubic)
			const easedProgress = 1 - Math.pow(1 - progress, 3);

			// Update state reactively
			animationState[property] = startValue + delta * easedProgress;

			if (progress < 1) {
				requestAnimationFrame(update);
			}
		}

		requestAnimationFrame(update);
	}

	function toggleStar(star: number) {
		selectedStars.update((stars) =>
			stars.includes(star) ? stars.filter((s) => s !== star) : [...stars, star]
		);
	}
</script>

<section class="space-y-5">
	<div class="flex flex-col space-y-2">
		<span class="text-md flex items-center gap-2 font-semibold">
			<Icon icon="hugeicons:maps-location-02" width="18" height="18" style="color: #575757" />
			<span>View on Map</span>
		</span>
		<div class="h-44 w-full rounded-none">
			<Dialog.Root >
				<div class="h-44 w-full overflow-hidden bg-gray-100">
					<Dialog.Trigger class="relative flex h-full w-full rounded-none justify-center">
						<Icon
							style="opacity: {animationState.iconOpacity}; transform: scale({animationState.iconScale});"
							class="text-blue-700 absolute top-[30%] z-30 transition-transform duration-300"
							icon="icomoon-free:location2"
							width="16"
							height="16"
						/>
						<div
							class="absolute top-[50%] z-30 rounded-full bg-gradient-to-br from-blue-800 to-blue-400 px-4 py-2 text-sm font-bold text-white transition-transform duration-300"
							style=" 
                                   opacity: {animationState.textScale}; 
                                   transform: scale({animationState.textScale}) translateY(0);
                                   animation: bounce 2s infinite ease-in-out;
                                   animation-delay: 400ms;"
						>
							Explore on Map
						</div>

						<!-- Map image with zoom animation -->
						<img
							style="transform: scale({animationState.mapScale})"
							class="z-20 h-full w-full object-cover transition-transform duration-300"
							src="/images/map-thumbnail.jpg"
							alt="Map thumbnail"
						/>
					</Dialog.Trigger>
				</div>
				<Dialog.Content class="h-screen lg:max-w-full lg:p-0 lg:rounded-none">
					<GoogleMaps />
				</Dialog.Content>
			</Dialog.Root>
		</div>
	</div>
	<div class="space-y-2">
		<div class="flex items-end justify-between">
			<span class="text-md flex items-center gap-3 font-semibold"
				><Icon icon="mdi:filter" width="24" height="24" style="color: #343432" /> Filter</span
			>
			<span class="cursor-pointer text-xs font-semibold text-blue-600">Reset All</span>
		</div>
		<Card.Root>
			<Card.Content>
				<!-- Star Rating -->
				<div class="mb-4">
					<span class="mb-2 block font-semibold">Star Rating</span>
					<div class="flex flex-wrap justify-center gap-2">
						<div class="flex flex-wrap justify-center gap-2">
							{#each [5, 4, 3, 2, 1] as star}
								<Button
									class="flex h-10 w-16 items-center justify-center gap-3 {$selectedStars.includes(
										star
									)
										? 'border-yellow-400 bg-yellow-100/30'
										: ''}"
									variant="outline"
									onclick={() => toggleStar(star)}
								>
									<span class="text-md font-bold">{star}</span>
									{#if star == 1 || star == 2}
										<Icon
											icon="material-symbols:star-rounded"
											width="20"
											height="20"
											style="color: #7d7d7d"
										/>
									{:else}
										<Icon
											icon="material-symbols:star-rounded"
											width="20"
											height="20"
											style="color: #ffed00"
										/>
									{/if}
								</Button>
							{/each}
						</div>
					</div>
				</div>

				<!-- Cancellation Option -->
				<div class="mb-4 space-y-2">
					<div class="font-semibold">Cancellation Option</div>
					<label class="inline-flex items-center">
						<input type="checkbox" class="form-checkbox" />
						<span class="ml-2 text-sm">Free cancellation property</span>
					</label>
				</div>

				<!-- Facilities -->
				<div class="mb-4">
					<span class="mb-2 block font-semibold">Facilities</span>
					<label class="mb-1 flex items-center">
						<input type="checkbox" checked class="form-checkbox" />
						<span class="ml-2 text-sm">Includes breakfast</span>
					</label>
					<label class="mb-1 flex items-center">
						<input type="checkbox" checked class="form-checkbox" />
						<span class="ml-2 text-sm">Includes fullboard</span>
					</label>
					<label class="flex items-center">
						<input type="checkbox" class="form-checkbox" />
						<span class="ml-2 text-sm">Non-smoking</span>
					</label>
				</div>

				<!-- Popular Area -->
				<div class="mb-4">
					<span class="mb-2 block font-semibold">Popular Area</span>
					{#each ['Asia Afrika', 'Dago', 'Riau', 'Lembang', 'Ciumbuleuit'] as area}
						<label class="mb-1 flex items-center text-sm">
							<input
								type="radio"
								name="area"
								value={area}
								class="form-radio"
								checked={area === 'Dago'}
							/>
							<span class="ml-2">{area}</span>
						</label>
					{/each}
					<Button variant="link" class="mt-1 inline-block w-full text-end text-xs">See more</Button>
				</div>

				<!-- Price Range -->
				<div>
					<span class="mb-2 block font-semibold">Price Range</span>
					<span class="mb-1 block text-xs">Price per room per night</span>
					<div class="mb-2 flex items-center justify-between gap-2 text-sm">
						<div class="w-[50%] rounded-md border px-2 py-1 text-xs">
							Min.<br /><span class="font-medium">IDR 0</span>
						</div>
						<div class="w-[50%] rounded-md border px-2 py-1 text-xs">
							Max<br /><span class="font-medium">IDR 16,000,000</span>
						</div>
					</div>
					<Slider type="multiple" bind:value max={100} step={1} class="max-w-full" />
				</div>
			</Card.Content>
		</Card.Root>
	</div>
</section>
