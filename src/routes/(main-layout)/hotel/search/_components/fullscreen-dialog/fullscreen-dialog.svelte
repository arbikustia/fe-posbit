<script lang="ts">
	import { fade } from 'svelte/transition';

	export let open: boolean = false;
	export let onClose: () => void;
</script>

{#if open}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-white"
		transition:fade
		on:click={() => onClose()}
	>
		<div
			class="relative w-full h-full bg-white shadow-xl overflow-hidden"
			on:click|stopPropagation
		>
			<!-- Tombol close -->
			<button
				class="absolute top-4 right-4 z-50 bg-gray-800 text-white px-3 py-1 rounded"
				on:click={onClose}
			>
				Close
			</button>

			<!-- Slot konten -->
			<slot />
		</div>
	</div>
{/if}
