<script lang="ts">
	import { onDestroy } from 'svelte';
	export let show = false;
	export let message = 'Copied!';
	export let duration = 2000;

	let timeout: ReturnType<typeof setTimeout>;

	$: if (show) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			show = false;
		}, duration);
	}

	onDestroy(() => clearTimeout(timeout));
</script>

{#if show}
	<div
		class="animate-fade-in-up fixed right-0 top-2 z-50 z-100 flex -translate-x-1/2 items-center gap-2 rounded bg-green-600 px-4 py-2 text-white shadow-lg"
	>
		<svg
			class="h-5 w-5 text-white"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
		</svg>
		<span>{message}</span>
	</div>
{/if}

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px) translateX(-50%);
		}
		to {
			opacity: 1;
			transform: translateY(0) translateX(-50%);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.3s;
	}
</style>
