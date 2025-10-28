<script lang="ts">
	import { goto } from '$app/navigation';
	import type { CarouselAPI } from '$lib/components/ui/carousel/context';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import type { SearchFormBannerType } from '$lib/types/Theme';
	import { cn } from '$lib/utils';
	import  ChevronRight  from '@lucide/svelte/icons/chevron-right';
	import  ChevronLeft from '@lucide/svelte/icons/chevron-left';
	import type { Snippet } from 'svelte';

	type SearchFormBannerProps = {
		content: Snippet;
		types: SearchFormBannerType[];
		data: {
			bannerImg: string;
			carouselImg: string[];
			carouselBackgroundImg: string;
		};
		title: string;
		lastSearch?: Snippet;
		fullscreen?: boolean;
	};

	const {
		content,
		types = [],
		data,
		title,
		lastSearch,
		fullscreen = false
	}: SearchFormBannerProps = $props();

	let carouselApi = $state<CarouselAPI>();

	let activeCarousel = $state(false);

	let carouselCanScrollNext = $state(true);

	let currentCarouselIdx = $state(0);

	const type = $derived.by(() => {
		if (types.length === 1) {
			return types[0];
		}

		if (types.length > 1) {
			return 'combination';
		}

		return 'none';
	});

	function onPrevCarousel() {
		if (activeCarousel && currentCarouselIdx === 0) {
			activeCarousel = false;
		}

		if (activeCarousel && currentCarouselIdx > 0) {
			carouselApi?.scrollPrev();
		}
	}

	function onNextCarousel() {
		if (activeCarousel) {
			carouselApi?.scrollNext();
		} else {
			activeCarousel = true;
		}
	}

	$effect(() => {
		if (carouselApi) {
			currentCarouselIdx = carouselApi.selectedScrollSnap();
			carouselApi.on('select', () => {
				const idx = carouselApi!.selectedScrollSnap();
				currentCarouselIdx = idx;
				carouselCanScrollNext = carouselApi?.canScrollNext() || false;
			});
		}
	});
</script>

{#snippet defaultBanner()}
	{#if type == 'none'}
		<div class="container">
			{@render content()}
		</div>
	{:else if type == 'image'}
		<img class="h-80 w-full object-cover object-center" src={data.bannerImg} alt="" />
		<div class="container relative z-20 -mt-20 py-0">
			{@render content()}
		</div>
	{:else if type === 'carousel' || type == 'combination'}
		<div
			class={cn('bg-linear-to-t from-primary to-primary/60 relative overflow-hidden pb-20 pt-4')}
		>
			{#if type === 'combination'}
				<img
					class="absolute -top-4 h-[calc(100%+var(--spacing)*5)] w-full"
					src={data.carouselBackgroundImg}
					alt="carousel-bg-img"
				/>
			{/if}
			<div
				class={cn(
					'text-primary-foreground w-100 absolute left-36 flex h-44 items-center transition-all duration-500',
					{
						'scale-80 opacity-0': activeCarousel
					}
				)}
			>
				<div class="text-xl font-semibold">{title}</div>
			</div>
			<div
				class={cn('duration-600 translate-x-0 transition-all', {
					'translate-x-110': !activeCarousel
				})}
			>
				<Carousel.Root
					class="mb-2 w-full"
					opts={{ active: true, watchDrag: false }}
					setApi={(emblaApi) => (carouselApi = emblaApi)}
				>
					<Carousel.Content class="z-2 pl-30 relative h-44">
						{#each data.carouselImg as item}
							<Carousel.Item
								class="w-100 basis-auto cursor-pointer"
								onclick={() => goto('/article/detail')}
							>
								<img class="h-full w-full rounded-md" src={item} alt="" />
							</Carousel.Item>
						{/each}
					</Carousel.Content>
				</Carousel.Root>
			</div>

			<div class="flex justify-center">
				<div class="text-primary-foreground z-4 flex items-center gap-24 text-sm">
					<button onclick={onPrevCarousel} disabled={!activeCarousel} class="disabled:opacity-50">
						<ChevronLeft class="size-5" />
					</button>
					<a href="/#">See more articles</a>
					<button
						onclick={onNextCarousel}
						disabled={!carouselCanScrollNext}
						class="disabled:opacity-50"
					>
						<ChevronRight class="size-5" />
					</button>
				</div>
			</div>
		</div>
		<div class="z-3 container relative -mt-28">
			{@render content()}
		</div>
	{/if}
{/snippet}

{#snippet fullscreenBanner()}
	{#if type == 'none'}
		<div class="min-h-screen w-full">
			<div class="container flex gap-10 pt-20">
				<div class="w-[35%]">
					{@render content()}
				</div>
				<div class="w-[65%]">
					{@render lastSearch?.()}
				</div>
			</div>
		</div>
	{:else if type == 'image'}
		<div class="relative min-h-screen w-full">
			<img
				class="absolute -z-10 h-full w-full object-cover object-center"
				src={data.bannerImg}
				alt=""
			/>
			<div class="container flex gap-10 pt-20">
				<div class="w-[35%]">
					{@render content()}
				</div>
				<div class="w-[65%]">
					{@render lastSearch?.()}
				</div>
			</div>
		</div>
	{:else if type === 'carousel' || type == 'combination'}
		<div
			class="relative h-full min-h-screen w-full pt-10 {type === 'combination'
				? 'bg-cover bg-no-repeat'
				: 'bg-linear-to-t from-primary to-primary/60'}"
			style={type === 'combination' ? `background-image: url(${data.carouselBackgroundImg})` : ''}
		>
			<div class="z-3 container relative flex w-full gap-10">
				<div class="w-[35%]">
					{@render content()}
				</div>
				<div class="w-[65%] overflow-hidden">
					<div class="mb-10">
						<div
							class={cn('duration-600 relative w-full translate-x-0 transition-all', {
								'': !activeCarousel
							})}
						>
							<Carousel.Root
								class="mb-2 w-full"
								opts={{ active: true, watchDrag: false }}
								setApi={(emblaApi) => (carouselApi = emblaApi)}
							>
								<Carousel.Content class="z-2 relative h-44">
									{#each data.carouselImg as item}
										<Carousel.Item class="w-100 basis-auto">
											<img class="h-full w-full rounded-md" src={item} alt="" />
										</Carousel.Item>
									{/each}
								</Carousel.Content>
							</Carousel.Root>
						</div>
						<div class="flex justify-center">
							<div class="text-primary-foreground z-4 flex items-center gap-24 text-sm">
								<button
									onclick={onPrevCarousel}
									disabled={!activeCarousel}
									class="disabled:opacity-50"
								>
									<ChevronLeft class="size-5" />
								</button>
								<a href="/#">See more articles</a>
								<button
									onclick={onNextCarousel}
									disabled={!carouselCanScrollNext}
									class="disabled:opacity-50"
								>
									<ChevronRight class="size-5" />
								</button>
							</div>
						</div>
					</div>
					{@render lastSearch?.()}
				</div>
			</div>
		</div>
	{/if}
{/snippet}

{#if fullscreen}
	{@render fullscreenBanner()}
{:else}
	{@render defaultBanner()}
{/if}
