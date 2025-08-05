<script lang="ts">
	let { isLast = false }: { isLast?: boolean } = $props();
</script>

{#snippet title(text: string)}
	<p class="text-base font-semibold leading-none">{text}</p>
{/snippet}

{#snippet subtitle(text: string)}
	<p class="text-sm text-gray-600">{text}</p>
{/snippet}

<div class="flex w-fit gap-x-4">
	<div class="w-28 justify-end text-end">
		{@render title('06:10')}
		{@render subtitle('Sun, 18 May 2025')}
	</div>
	{#if isLast}
		<div class="flex w-2 flex-col items-center">
			<div class="h-3 w-3 rounded-full border border-primary bg-primary"></div>
		</div>
	{:else}
		<div class="flex w-2 flex-col items-center">
			<div class="mt-2 h-3 w-3 rounded-full border border-primary"></div>
			<div class="w-px flex-1 bg-gray-400"></div>
		</div>
	{/if}
	<div class={'flex-1'}>
		{@render title('GMR - Gambir')}
		{@render subtitle('Stasiun Gambir, Jakarta')}
	</div>
</div>
