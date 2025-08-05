<script lang="ts">
	let { isActive }: { isActive: boolean } = $props();
</script>

{#if isActive}
	<span class="absolute bottom-0 left-0 top-0 w-1 rounded-r-md bg-primary"></span>
{/if}
