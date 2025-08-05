<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import * as Card from '$lib/components/ui/card';
	import { MLastSearch } from '../last-search';
	import { MSearchForm } from '../search-form';

	const bgUrl =
		'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/original/test-discovery/2023/08/10/25f00554-356a-42ec-8ae4-3bb0b178968d-1691648479703-63eb526a0e874e577439a58c453454e3.png';
</script>

<MOSGAppBar>
	{#snippet leftContent()}
		<div class="text-lg font-semibold">Flight</div>
	{/snippet}
</MOSGAppBar>
<div class="relative">
	<div
		class="bg-(image:--bg-url) fixed top-12 z-[-1] h-56 w-full max-w-lg rounded-b-2xl bg-cover bg-center"
		style="--bg-url: url({bgUrl})"
	></div>
	<div class="mt-40 space-y-4 px-3">
		<Card.Root class="py-0">
			<Card.Content class="p-4">
				<MSearchForm />
			</Card.Content>
		</Card.Root>
		<div>
			<MLastSearch />
		</div>
	</div>
</div>
