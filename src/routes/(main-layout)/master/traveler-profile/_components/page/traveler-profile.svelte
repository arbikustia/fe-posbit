<script lang="ts">
	import Table from '../table.svelte';
	import * as Card from '$lib/components/ui/card';
</script>

<div class="container">
	<Card.Root>
		<Card.Content>
			<div class="max-w-4xl">
				<div class="mb-2 flex items-center justify-between">
					<h3 class="text-base font-semibold">Traveler Profile</h3>
					<input type="text" placeholder="Search" class="w-48 rounded border px-2 py-1 text-sm" />
				</div>

				<div class="">
					<Table />
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</div>
