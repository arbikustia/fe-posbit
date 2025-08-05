<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { page } from '$app/stores'; // Mengakses URL aktif
	import { cn } from '$lib/utils';
	import { currentPage } from '$lib/helpers/page-helper';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	export let href = '';
	export let label = '';

	$: isActive = currentPage($page.url.pathname) === href;
</script>

<Button
	{href}
	variant="ghost"
	class={cn(
		'navbar-item hover:bg-sidebar-accent hover:text-sidebar-accent-foreground relative h-full rounded-none py-4',
		isActive && 'bg-accent/50 text-primary hover:text-sidebar-accent-foreground',
		isActive &&
			$themeConfigStore.navigationColor !== 'default' &&
			'bg-accent/30 text-sidebar-accent-foreground'
	)}
>
	<div class="wrap flex items-center gap-x-3">
		<slot name="icon" />
		<div>{label}</div>
	</div>
	{#if isActive && $themeConfigStore.navigationColor === 'default'}
		<div class="border-primary absolute right-0 bottom-[-2px] left-0 rounded-t-lg border-t-4"></div>
	{/if}
</Button>
