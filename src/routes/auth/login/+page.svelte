<script lang="ts">
	import { OSGLoginV1 } from './_components/login-v1';
	import { LoginV2, LoginV2Left, LoginV2Right } from './_components/login-v2';
	import { page } from '$app/state';
	import { LoginV3 } from './_components/login-v3';
	import { onMount } from 'svelte';
	export let data;

	const searchParam = Object.fromEntries(page.url.searchParams);

	onMount(() => {
		try {
			const el = document.documentElement;

			// 🔹 Fullscreen untuk semua browser
			if (el.requestFullscreen) {
				el.requestFullscreen();
			} else if ((el as any).webkitRequestFullscreen) {
				// Safari / iPadOS / older WebKit
				(el as any).webkitRequestFullscreen();
			} else if ((el as any).msRequestFullscreen) {
				// Old Microsoft Edge / IE
				(el as any).msRequestFullscreen();
			}
		} catch (e) {
			console.warn('Gagal masuk fullscreen:', e);
		}
	});
</script>

{#if searchParam.id == 'v2'}
	{#if searchParam.layout == 'right'}
		<LoginV2Right {data} />
	{:else if searchParam.layout == 'left'}
		<LoginV2Left {data} />
	{:else}
		<LoginV2 {data} />
	{/if}
{:else if searchParam.id == 'v3'}
	<LoginV3 {data} />
{:else}
	<!-- <LoginV2Left {data}1 /> -->
	<LoginV2 {data} />
{/if}
