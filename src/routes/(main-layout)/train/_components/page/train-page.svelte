<script lang="ts">
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { cn } from '$lib/utils';
	import { SearchFormBanner } from '../../../(component)/search-form-banner';
	import { LastSearch } from '../last-search';
	import { SearchForm, SearchFormCompact } from '../search-form';

	const data = {
		bannerImg:
			'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/test-discovery/2024/08/02/5cd1eedb-2bb4-4c23-97e1-68f008d37de3-1722564485895-d3c85f5b0f336e0408f9025ea0e907fb.png',
		carouselImg: [
			'https://tse2.mm.bing.net/th/id/OIP.3ZEOTxYFD82PnEPf7hFYwwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3',
			'https://ahgroup-pk.com/blog/wp-content/uploads/2023/11/insurance-insurance-companies-in-pakistan-ahgroup-pk.jpeg',
			'https://images.unsplash.com/photo-1465101046530-73398c7f28ca',
			'https://images.unsplash.com/photo-1519125323398-675f0ddb6308'
		],
		carouselBackgroundImg:
			'http://p16-images-comn-sg.tokopedia-static.net/tos-alisg-i-zr7vqa5nfb-sg/img/gopay/bg-desktop.png~tplv-zr7vqa5nfb-image.image'
	};
</script>

<SearchFormBanner
	types={$themeConfigStore.train.searchFormBanner}
	{data}
	title="Search and book cheap train here!!"
	fullscreen={$themeConfigStore.train.searchForm === 'compact'}
>
	{#snippet content()}
		{#if $themeConfigStore.train.searchForm === 'compact'}
			<SearchFormCompact />
		{:else}
			<div class="space-y-12">
				<SearchForm />
				<LastSearch />
			</div>
		{/if}
	{/snippet}

	{#snippet lastSearch()}
		{#if $themeConfigStore.train.searchForm === 'compact'}
			<LastSearch
				class="grid-cols-3"
				titleClass={cn({
					'text-primary-foreground': $themeConfigStore.train.searchFormBanner.length > 0
				})}
				clearBtnClass={cn({
					'text-primary-foreground': $themeConfigStore.train.searchFormBanner.length > 0
				})}
			/>
		{/if}
	{/snippet}
</SearchFormBanner>
