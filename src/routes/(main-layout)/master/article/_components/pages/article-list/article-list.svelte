<script lang="ts">
	import { goto } from '$app/navigation';
	import { SearchField } from '$lib/components/opsigo-ui/input';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { TableArtice } from '../../table-article';
	import type { TableArticleRow } from '$lib/types/Article';
	import { dummyArticle } from './dummy-article';

	const rows: TableArticleRow[] = dummyArticle;

	let search = $state('');
</script>

<div class="container">
	<div class="mb-6 flex items-center justify-between">
		<div>
			<h3 class="text-2xl font-bold text-gray-800">Manage Articles</h3>
			<p class=" text-gray-500">Write, edit, and publish article</p>
		</div>
		<Button size="lg" onclick={() => goto('/master/article/create')}>
			<Icon icon="ic:baseline-plus" />
			Create
		</Button>
	</div>

	<SearchField bind:value={search} className="w-full max-w-xs" />

	<TableArtice {rows} />
</div>
