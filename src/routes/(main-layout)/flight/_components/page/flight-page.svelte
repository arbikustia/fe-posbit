<script lang="ts">
	import { SearchForm, SearchFormCompact } from '../search-form';
	import { LastSearch } from '../last-search';
	import { SearchFormBanner } from '../../../(component)/search-form-banner';
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { cn } from '$lib/utils';

	const data = {
		bannerImg:
			'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/original/test-discovery/2023/08/10/25f00554-356a-42ec-8ae4-3bb0b178968d-1691648479703-63eb526a0e874e577439a58c453454e3.png',
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
	types={$themeConfigStore.flight.searchFormBanner}
	{data}
	title="Search and book cheap flight here!!"
	fullscreen={$themeConfigStore.flight.searchForm === 'compact'}
>
	{#snippet content()}
		{#if $themeConfigStore.flight.searchForm === 'compact'}
			<SearchFormCompact />
		{:else}
			<div class="space-y-12">
				<SearchForm />
				<LastSearch />
			</div>
		{/if}
	{/snippet}

	{#snippet lastSearch()}
		{#if $themeConfigStore.flight.searchForm === 'compact'}
			<LastSearch
				class="grid-cols-3"
				titleClass={cn({
					'text-primary-foreground': $themeConfigStore.flight.searchFormBanner.length > 0
				})}
				clearBtnClass={cn({
					'text-primary-foreground': $themeConfigStore.flight.searchFormBanner.length > 0
				})}
			/>
		{/if}
	{/snippet}
</SearchFormBanner>
