<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { MArticleList, ArticleList } from './_components/pages/article-list/index';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MArticleList />
{:else}
	<ArticleList />
{/if}
