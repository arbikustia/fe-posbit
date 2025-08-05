<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import SeatSelect from './seat-select.svelte';
	import * as Carousel from '$lib/components/ui/carousel';
	import * as Select from '$lib/components/ui/select';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import ActiveSelectionIndicator from '$lib/components/opsigo-ui/active-selection-indicator/active-selection-indicator.svelte';

	const journeyOptions = [
		{ label: 'GMR-BD', value: 'gmr-bd' },
		{ label: 'BD-GMR', value: 'bd-gmr' }
	];

	const railways = [
		{
			id: '1',
			name: 'Premium Economy 1',
			availabelSeats: 11
		},
		{
			id: '2',
			name: 'Premium Economy 2',
			availabelSeats: 15
		},
		{
			id: '3',
			name: 'Premium Economy 3',
			availabelSeats: 20
		}
	];

	const passengers = Array(2)
		.fill(0)
		.map((_, i) => i + 1);

	let { open = $bindable() }: { open: boolean } = $props();

	let selectedJourney = $state('gmr-bd');
	let selectedPassenger = $state<number>();
	let carouselApi = $state<CarouselAPI>();
	let selectedRailway = $state('1');
	let currentCarouselIdx = $state(0);

	const selectedRailwayName = $derived(railways.find((item) => item.id === selectedRailway)?.name);

	$effect(() => {
		if (carouselApi) {
			currentCarouselIdx = carouselApi.selectedScrollSnap();
			carouselApi.on('select', () => {
				const idx = carouselApi!.selectedScrollSnap();
				currentCarouselIdx = idx;
				selectedRailway = railways[idx].id;
			});
		}
	});
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="gap-0 p-0 lg:max-w-5xl">
		<Dialog.Header class="border-b p-4">
			<Dialog.Title>
				<div class="grid grid-cols-12">
					<div class="col-span-4 flex items-center gap-x-3">
						<img
							class="h-6"
							src="https://cdn-icons-png.flaticon.com/512/4652/4652184.png"
							alt="Seat Icon"
						/>
						Seat Selection
					</div>
					<div class="col-span-8 m-auto">
						<ToggleGroup.Root
							value={selectedJourney}
							variant="outline"
							type="single"
							class="eq-toggle-root items-center! justify-center! w-fit"
						>
							{#each journeyOptions as journeyOptions}
								<ToggleGroup.Item
									value={journeyOptions.value}
									aria-label={`Toggle ${journeyOptions.label}`}
									class="eq-toggle-item"
								>
									{journeyOptions.label}
								</ToggleGroup.Item>
							{/each}
						</ToggleGroup.Root>
					</div>
				</div>
			</Dialog.Title>
		</Dialog.Header>
		<div class="grid min-h-52 grid-cols-12 bg-gray-200">
			<div class="col-span-4 h-fit bg-white shadow-md">
				<div class="p-4">
					<Badge variant="secondary" class="items-start gap-x-1">
						<span class="leading-none">Departure</span>
					</Badge>
					<div class="flex justify-between">
						<div class="flex items-center font-semibold">
							<p>GMR</p>
							<Icon icon="mdi-light:arrow-right" />
							<p>BD</p>
						</div>
						<img
							class="h-10 w-10 object-contain"
							src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/kai.png"
							alt="Train"
						/>
					</div>
					<div class="flex justify-between text-sm text-gray-500">
						<p>2025-03-11 18:15</p>

						<p>KA-137</p>
					</div>
				</div>
				<Separator />
				{#each passengers as passenger}
					<Button
						variant="ghost"
						class={cn(
							'relative flex h-fit w-full items-start justify-start gap-x-2 rounded-none px-4 text-start',
							{
								'bg-primary/10!': selectedPassenger === passenger,
								'text-primary!': selectedPassenger === passenger
							}
						)}
						onclick={() => (selectedPassenger = passenger)}
					>
						{passenger}.
						<div class="flex-1 space-y-2">
							<p>Adult {passenger}</p>
							<p class="text-gray-500">Pick Seat</p>
							<div class="text-gray-500">3B</div>
						</div>

						<ActiveSelectionIndicator isActive={selectedPassenger === passenger} />
					</Button>
					<Separator />
				{/each}
			</div>
			<div class="custom-scrollbar col-span-8 max-h-[70vh] overflow-auto pb-10">
				<div class="mt-4 flex w-full justify-evenly gap-x-4">
					<div class="flex flex-col items-center text-center">
						<div class={cn('h-5 w-5 rounded-md bg-blue-900')}></div>

						<p class="text-sm text-gray-500">Available</p>
					</div>
					<div class="flex flex-col items-center text-center">
						<div class={cn('h-5 w-5 rounded-md bg-green-500')}></div>

						<p class="text-sm text-gray-500">Selected</p>
					</div>
					<div class="flex flex-col items-center text-center">
						<div class={cn('h-5 w-5 rounded-md bg-gray-300')}></div>

						<p class="text-sm text-gray-500">Unavailable</p>
					</div>
				</div>
				<div class="mt-4 flex items-center justify-center">
					<Select.Root
						type="single"
						bind:value={selectedRailway}
						onValueChange={(val) => {
							const idx = railways.findIndex((item) => item.id === val);

							carouselApi?.scrollTo(idx);
						}}
					>
						<Select.Trigger class="bg-card w-fit">{selectedRailwayName}</Select.Trigger>
						<Select.Content>
							{#each railways as railway}
								<Select.Item value={railway.id}>
									{railway.name} - {railway.availabelSeats} seats left
								</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				</div>
				<div class="px-32">
					<Carousel.Root
						setApi={(emblaApi) => (carouselApi = emblaApi)}
						opts={{
							skipSnaps: true
						}}
					>
						<Carousel.Content>
							{#each railways as railway}
								<Carousel.Item><SeatSelect /></Carousel.Item>
							{/each}
						</Carousel.Content>
						<Carousel.Previous />
						<Carousel.Next />
					</Carousel.Root>

					<div class="flex justify-center">
						<div class="flex items-center gap-1">
							{#each railways as railway, idx}
								<div
									class={cn('h-2 w-2 rounded-full bg-slate-300', {
										'bg-slate-600': currentCarouselIdx === idx
									})}
								></div>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
		<Dialog.Footer class="p-4">
			<div class="ml-auto flex items-center justify-end gap-x-2">
				<Button variant="ghost">Reset</Button>
				<Button
					onclick={() => {
						open = false;
					}}>Done</Button
				>
			</div>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
