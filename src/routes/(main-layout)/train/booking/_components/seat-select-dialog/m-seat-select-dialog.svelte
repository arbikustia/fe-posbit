<script lang="ts">
	import { Reset } from '$lib/components/icons';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import * as Carousel from '$lib/components/ui/carousel';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Select from '$lib/components/ui/select';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { ancillaryIconUrl } from '$lib/constants/app';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import { ArrowLeft, ArrowRight, ChevronUp } from '@lucide/svelte';
	import MSeatSelect from './m-seat-select.svelte';

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

	let isOpenFareDetail = $state(false);
	let isOpenSeatSelection = $state(false);
	let selectedPassengerIdx = $state(0);
	let selectedJourney = $state('gmr-bd');
	let selectedPassenger = $state<number>();
	let carouselApi = $state<CarouselAPI>();
	let selectedRailway = $state('1');
	let currentCarouselIdx = $state(0);

	const selectedRailwayName = $derived(railways.find((item) => item.id === selectedRailway)?.name);

	const totalPriceSelectedSeat = `${formatThousand(100000)} IDR`;

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

<Drawer.Root bind:open>
	<Drawer.Content
		class="border-none bg-gray-100 p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="bg-primary/85 text-primary-foreground static max-w-full">
			{#snippet leftAction()}
				<button
					onclick={() => {
						open = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="flex items-center gap-x-4 text-lg font-semibold">
					<img class="h-6" src={ancillaryIconUrl.seat} alt="Seat Icon" />
					Seat Selection
				</div>
			{/snippet}

			{#snippet rightContent()}
				<button>
					<Reset />
				</button>
			{/snippet}
		</MOSGAppBar>
		<div class="p-4">
			<div class="space-y-4">
				{#each Array(2) as trip, tripIdx}
					{@const isAvailable = true}
					<div class="space-y-2">
						<p class="text-lg font-semibold">
							{tripIdx === 0 ? 'Departure' : 'Return'}
						</p>
						<div class="rounded-xl border border-gray-400 p-4">
							<div class="flex items-center justify-between">
								<div class="space-y-1">
									<div class="flex items-center gap-4">
										<div class="rounded-full border border-gray-400 p-2">
											<img
												class="h-8 w-8 object-contain"
												src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/kai.png"
												alt="Train"
											/>
										</div>
										<div>
											<p class="font-semibold">Gambir - Bandung</p>
											<p class="text-sm text-gray-500">19 Jun, 13:00 - 17:00 ∙ 4h</p>
										</div>
									</div>
								</div>
								{#if isAvailable}
									<Button
										variant="link"
										class="h-fit p-0 hover:no-underline"
										onclick={() => (isOpenSeatSelection = true)}>Select</Button
									>
								{:else}
									<p class="text-sm text-gray-400">Not Available</p>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			{#if totalPriceSelectedSeat !== ''}
				<div>
					<button class="flex items-center gap-x-1" onclick={() => (isOpenFareDetail = true)}>
						<p class="text-sm"><span class="font-semibold">Subtotal</span> (Seat Selection)</p>
						<ChevronUp class="h-5 w-5" />
					</button>
					<p class="font-semibold">
						{totalPriceSelectedSeat}
					</p>
				</div>
			{:else}
				<p class="text-sm text-gray-500"><span class="font-semibold">No Selected</span></p>
			{/if}

			<Button class="px-8" onclick={() => (open = false)}>Done</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>

<!-- Seat Selection Drawer -->
<Drawer.Root bind:open={isOpenSeatSelection}>
	<Drawer.Content
		class="border-none bg-gray-200 p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="bg-primary/85 text-primary-foreground static max-w-full">
			{#snippet leftAction()}
				<button
					onclick={() => {
						isOpenSeatSelection = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="text-lg font-semibold">
					<div class="flex items-center gap-2">
						Gambir
						<ArrowRight />
						Bandung
					</div>
					<p class="text-sm font-normal">Thu, 19 Jun 25</p>
				</div>
			{/snippet}
		</MOSGAppBar>
		<div>
			<div class="scrollbar-hide flex items-center gap-x-2 overflow-x-auto p-2">
				{#each passengers as passenger, passengerIdx}
					{@const isSelected = selectedPassengerIdx === passengerIdx}

					<button
						class={cn(
							'h-18 min-w-38 cursor-pointer space-y-1 rounded-md border border-gray-300 bg-white px-4 text-start',
							{
								'ring-primary ring-2': isSelected
							}
						)}
						onclick={() => (selectedPassengerIdx = passengerIdx)}
					>
						<div class="flex items-center gap-4">
							<div
								class={cn('text-lg font-semibold', {
									'text-primary': isSelected
								})}
							>
								{passengerIdx + 1}
							</div>
							<div>
								<p class="font-semibold">Adult {passengerIdx + 1}</p>

								<p class="text-sm">No Preference</p>
							</div>
						</div>
					</button>
				{/each}
			</div>
		</div>
		<div class="h-full overflow-x-auto overflow-y-auto pb-32">
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
			<div>
				<Carousel.Root
					setApi={(emblaApi) => (carouselApi = emblaApi)}
					opts={{
						skipSnaps: true
					}}
				>
					<Carousel.Content>
						{#each railways as railway}
							<Carousel.Item><MSeatSelect /></Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous class="left-1" />
					<Carousel.Next class="right-1" />
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

		<div class="absolute bottom-0 flex w-full items-center justify-between border-t-2 bg-white p-4">
			<div>
				<p class="text-sm">Subtotal</p>

				<p class="font-semibold">
					{formatThousand(100000)} IDR
				</p>
			</div>

			<Button class="px-8" onclick={() => (isOpenSeatSelection = false)}>Save</Button>
		</div>
	</Drawer.Content>
</Drawer.Root>

<!-- Fare Detail -->
<Drawer.Root bind:open={isOpenFareDetail}>
	<Drawer.Content class="border-none p-0">
		<Drawer.Header>
			<Drawer.Title>Fare Detail</Drawer.Title>
		</Drawer.Header>

		<div class="space-y-4 px-4 pb-4">
			{#each Array(2) as trip, i}
				{@const isLast = i === Array(2).length - 1}
				<div class="space-y-4">
					<p class="font-semibold">Gambir → Bandung</p>

					{#each Array(2) as seat}
						<div class="grid grid-cols-12 gap-2">
							<div class="col-span-5 truncate">Mr. John Doe</div>
							<div class="col-span-7 flex justify-between">
								<div>6H</div>
								<div class="text-right">
									{formatThousand(100000)}
									IDR
								</div>
							</div>
						</div>
					{/each}

					{#if !isLast}
						<div class="w-full border-b-2 border-dashed border-gray-400"></div>
					{/if}
				</div>
			{/each}
		</div>
		<Separator />
		<div class="flex justify-between p-4 font-semibold">
			<div>Total</div>
			<div>{totalPriceSelectedSeat}</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
