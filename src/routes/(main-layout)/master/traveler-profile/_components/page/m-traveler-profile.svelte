<script lang="ts">
	import Table from '../table.svelte';
	import * as Card from '$lib/components/ui/card';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
</script>

<MOSGAppBar class="bg-blue-800 text-neutral-50">
	{#snippet leftContent()}
		<div class="w-[80vw] text-center text-lg font-semibold text-neutral-50">Traveler Profile</div>
	{/snippet}
</MOSGAppBar>

<Card.Root>
	<Card.Content>
		<div class="max-w-4xl pt-5">
			<div class="mb-2 flex items-center justify-between">
				<input type="text" placeholder="Search" class="w-48 rounded border px-2 py-1 text-sm" />
			</div>

			<div class="">
				<Table />
			</div>
		</div>
	</Card.Content>
</Card.Root>
