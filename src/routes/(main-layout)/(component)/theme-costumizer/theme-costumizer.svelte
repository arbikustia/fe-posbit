<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Dialog from '$lib/components/ui/dialog';
	import { defaultThemeConfig, themeConfigStore } from '$lib/stores/themeConfigStore';
	import {
		themeLogoTypes,
		themeColors,
		themeFonts,
		themeNavbars,
		themeNavigations,
		themeRadius,
		themeSearchFormBanners,
		themeSidebars,
		themeSearchFormTypes
	} from '$lib/registry/themes';
	import { cn } from '$lib/utils.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Label } from '$lib/components/ui/label';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { derived } from 'svelte/store';
	import { onMount, type Snippet } from 'svelte';
	import Icon from '@iconify/svelte';
	import X from '@lucide/svelte/icons/x';
	import { getDeviceContext } from '$lib/context/device';
	import type { SearchFormBannerType, SearchFormType, ThemeConfig } from '$lib/types/Theme';
	import { Separator } from '$lib/components/ui/separator';

	type ThemeCostumizerProps = {
		trigger?: Snippet;
	};

	let { trigger }: ThemeCostumizerProps = $props();

	const { isMobile } = getDeviceContext();

	const selectedTheme = derived(themeConfigStore, ($themeConfigStore) =>
		themeColors.find((theme) => theme.name === $themeConfigStore.color)
	);

	const themeNavColors = [
		{ name: 'default', label: 'Default', activeColor: '#ffffff' },
		...themeColors
	];

	let isMounted = $state(false);
	let open = $state(false);

	const Wrapper = isMobile ? Drawer : Dialog;

	function resetTheme() {
		$themeConfigStore = { ...defaultThemeConfig };
	}

	onMount(() => {
		isMounted = true;
	});
</script>

{#snippet searchFormBannerConfig(
	key: Extract<keyof ThemeConfig, 'flight' | 'hotel' | 'train' | 'insurance'>
)}
	<div class="grid grid-cols-2 gap-2">
		{#each themeSearchFormBanners as item, _ (item)}
			{@const banner = item as unknown as SearchFormBannerType}
			{@const selected = $themeConfigStore[key].searchFormBanner.includes(banner)}
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					if (selected) {
						$themeConfigStore[key].searchFormBanner = $themeConfigStore[
							key
						].searchFormBanner.filter((b) => b !== banner);
					} else {
						// If not selected, add it to the array
						$themeConfigStore[key].searchFormBanner = [
							...$themeConfigStore[key].searchFormBanner,
							banner
						];
					}
				}}
				class={cn('capitalize', {
					'border-primary border-2': selected
				})}
			>
				{banner}
			</Button>
		{/each}
	</div>
{/snippet}

{#snippet searchFormTypeConfig(
	key: Extract<keyof ThemeConfig, 'flight' | 'hotel' | 'train' | 'insurance'>
)}
	<div class="grid grid-cols-2 gap-2">
		{#each themeSearchFormTypes as type, _ (type)}
			<Button
				variant="outline"
				size="sm"
				onclick={() => {
					$themeConfigStore[key].searchForm = type as SearchFormType;
				}}
				class={cn('capitalize', {
					'border-primary border-2': $themeConfigStore[key].searchForm === type
				})}
			>
				{type}
			</Button>
		{/each}
	</div>
{/snippet}

<div class="flex w-full items-center space-x-2">
	<div class="w-full">
		<Wrapper.Root bind:open >
			{#if trigger}
				{@render trigger()}
			{:else}
				<Wrapper.Trigger
					class={cn(
						'w-full',
						!isMobile && buttonVariants({ variant: 'outline', class: 'text-gray-500' })
					)}
				>
					{#if isMobile}
						<div
							class={cn(
								'text-(--sidebar-foreground)/80 mt-2 flex w-full items-center justify-between gap-2 px-2 font-semibold'
							)}
						>
							<span>Theme</span>
							<Icon
								icon="weui:arrow-outlined"
								width="12"
								height="24"
								class="text-(--sidebar-foreground)/80"
							/>
						</div>
					{:else}
						<span class="font-normal">Theme:</span>
						{#if isMounted}
							{$selectedTheme?.label ?? 'Default'}
						{:else}
							...
						{/if}
						<ChevronDown />
					{/if}
				</Wrapper.Trigger>
			{/if}

			<Wrapper.Content
				class={cn('z-60! bg-white dark:bg-zinc-950', {
					'h-fit w-full p-0': isMobile,
					'max-h-screen w-screen p-6': !isMobile
				})}
				fullscreen
			>
				<div class={cn('flex flex-col space-y-2', isMobile && 'p-6')}>
					<div class="flex items-center">
						<div class="space-y-1 pr-2">
							<div class="font-semibold leading-none tracking-tight">Switch Theme</div>
							<div class="text-muted-foreground text-xs">Pick a style and color.</div>
						</div>
						<Button
							variant="ghost"
							size="icon"
							class="ml-auto rounded-[0.5rem]"
							title="Reset"
							onclick={resetTheme}
						>
							<Icon icon="bx:reset" width="24" height="24" />
						</Button>

						{#if isMobile}
							<Drawer.Close class="rounded-full p-1 hover:bg-gray-100">
								<X class="h-6 w-6" />
							</Drawer.Close>
						{/if}
					</div>
					<div
						class={[
							'flex flex-col gap-3',
							{ ' custom-scrollbar max-h-[calc(100vh-120px)] overflow-auto': !isMobile }
						]}
					>
						<div class="font-semibold">General</div>
						<div class="space-y-1">
							<Label class="text-xs">Color</Label>
							<div class="grid grid-cols-3 gap-2">
								{#each themeColors as theme (theme.name)}
									{@const isActive = $themeConfigStore.color === theme.name}
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											$themeConfigStore.color = theme.name;
										}}
										class={cn('justify-start', isActive && 'border-primary border-2')}
										style="--theme-primary: {theme.activeColor}"
									>
										<span
											class="bg-(--theme-primary) mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full"
										>
											{#if isActive}
												<Check class="h-4 w-4 text-white" />
											{/if}
										</span>
										{theme.label}
									</Button>
								{/each}
							</div>
						</div>
						<div class="space-y-1.5">
							<Label class="text-xs">Radius</Label>
							<div class="grid grid-cols-5 gap-2">
								{#each themeRadius as value, _ (value)}
									{@const valueFloat = Number.parseFloat(value)}
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											$themeConfigStore.radius = valueFloat;
										}}
										class={cn($themeConfigStore.radius === valueFloat && 'border-primary border-2')}
									>
										{value}
									</Button>
								{/each}
							</div>
						</div>
						<div class="space-y-1.5">
							<Label class="text-xs">Fonts</Label>
							<div class="grid auto-rows-fr grid-cols-2 gap-2 sm:grid-cols-3">
								{#each themeFonts as value, _ (value)}
									{@const valueFloat = value as ThemeConfig['font']}
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											$themeConfigStore.font = valueFloat;
										}}
										style="font-family: {valueFloat}, sans-serif !important;"
										class={cn($themeConfigStore.font === valueFloat && 'border-primary border-2')}
									>
										{value}
									</Button>
								{/each}
							</div>
						</div>

						<Separator />
						<div class="font-semibold">Navigation</div>

						{#if !isMobile}
							<div class="space-y-1.5">
								<Label class="text-xs">Type</Label>
								<div class="grid grid-cols-2 gap-2">
									{#each themeNavigations as navigation, _ (navigation)}
										<Button
											variant="outline"
											size="sm"
											onclick={() => {
												$themeConfigStore.navigation = navigation as ThemeConfig['navigation'];
											}}
											class={cn('capitalize', {
												'border-primary border-2': $themeConfigStore.navigation === navigation
											})}
										>
											{navigation}
										</Button>
									{/each}
								</div>
							</div>
						{/if}
						{#if !isMobile && $themeConfigStore.navigation === 'navbar'}
							<div class="space-y-1.5">
								<Label class="text-xs">Style</Label>
								<div class="grid grid-cols-3 gap-2">
									{#each themeNavbars as navbar, _ (navbar.key)}
										<Button
											variant="outline"
											size="sm"
											onclick={() => {
												$themeConfigStore.navbar = navbar.key;
											}}
											class={cn(
												$themeConfigStore.navbar === navbar.key && 'border-primary border-2'
											)}
										>
											{navbar.label}
										</Button>
									{/each}
								</div>
							</div>
						{/if}
						{#if !isMobile && $themeConfigStore.navigation === 'sidebar'}
							<div class="space-y-1.5">
								<Label class="text-xs">Style</Label>
								<div class="grid grid-cols-3 gap-2">
									{#each themeSidebars as sidebar, _ (sidebar.key)}
										<Button
											variant="outline"
											size="sm"
											onclick={() => {
												$themeConfigStore.sidebar = sidebar.key;
											}}
											class={cn(
												$themeConfigStore.sidebar === sidebar.key && 'border-primary border-2'
											)}
										>
											{sidebar.label}
										</Button>
									{/each}
								</div>
							</div>
						{/if}
						<div class="space-y-1">
							<Label class="text-xs">Color</Label>
							<div class="grid grid-cols-3 gap-2">
								{#each themeNavColors as theme (theme.name)}
									{@const isActive = $themeConfigStore.navigationColor === theme.name}
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											$themeConfigStore.navigationColor = theme.name;
										}}
										class={cn('justify-start', isActive && 'border-primary border-2')}
										style="--sidebar: {theme.activeColor}"
									>
										<span
											class="bg-sidebar mr-1 flex h-5 w-5 shrink-0 -translate-x-1 items-center justify-center rounded-full"
										>
											{#if isActive}
												<Check class="h-4 w-4 text-white" />
											{/if}
										</span>
										{theme.label}
									</Button>
								{/each}
							</div>
						</div>
						<div class="space-y-1">
							<Label class="text-xs">Logo</Label>
							<div class="grid grid-cols-2 gap-2">
								{#each themeLogoTypes as logo}
									<Button
										variant="outline"
										size="sm"
										onclick={() => {
											$themeConfigStore.logoType = logo;
										}}
										class={cn(
											'capitalize',
											$themeConfigStore.logoType === logo && 'border-primary border-2'
										)}
									>
										{logo}
									</Button>
								{/each}
							</div>
						</div>

					</div>
				</div>
			</Wrapper.Content>
		</Wrapper.Root>
	</div>
</div>
