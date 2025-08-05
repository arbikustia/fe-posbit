<script lang="ts">
	import { getDeviceContext } from '$lib/context/device';
	import { MArticleForm, ArticleForm } from '../_components/pages/article-form/index';

	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<MArticleForm />
{:else}
	<ArticleForm />
{/if}
