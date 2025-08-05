<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner/index.js';
	import { updateTheme } from '$lib/utils';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { setDeviceContext } from '$lib/context/device';
	import { onMount } from 'svelte';

	let { children, data } = $props();

	let isMounted = $state(false);

	setDeviceContext({ isMobile: data.isMobile });

	$effect(() => {
		updateTheme($themeConfigStore);
	});

	onMount(() => {
		isMounted = true;
	});
</script>

<svelte:head>
	<style>
		@import '/registry/themes.css';
	</style>
</svelte:head>

{#if isMounted}
	<Toaster position="top-center" richColors />
	{@render children()}
{:else}
	<div class="flex h-screen items-center justify-center">
		<div class="flex flex-col items-center gap-4">
			<img
				class="block h-12 object-contain object-center"
				src="/images/opsigo-logo.png"
				alt="Opsigo"
			/>
			<div class="relative h-[4px] w-52 overflow-hidden rounded-full bg-black/20">
				<div class="animate-moving bg-primary absolute h-full rounded-full"></div>
			</div>
		</div>
	</div>
{/if}
