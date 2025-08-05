<!-- ScrollToTop.svelte -->
<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte";
	import { onMount } from "svelte";

	let visible = false;

	function checkScroll() {
		visible = window.scrollY > 300;
	}

	function scrollToTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}

	// Aktifkan event scroll
	onMount(() => {
		window.addEventListener('scroll', checkScroll);
		return () => window.removeEventListener('scroll', checkScroll);
	});
</script>

{#if visible}
	<Button
		onclick={scrollToTop}
		class="fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition"
	>
		<!-- Icon panah atas -->
		<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
		</svg>
	</Button>
{/if}
