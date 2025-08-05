<script>
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { cn } from '$lib/utils';
	import { SearchFormBanner } from '../../../(component)/search-form-banner';
	import { ScrollToTop } from '../../../hotel/detail/_components/scroll-to-top';
	import { LastSearchInsurance } from '../last-search';
	import { SearchFormInsurance } from '../search-form';

	const data = {
		bannerImg:
			'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/events/2023/08/14/0c192123-671a-4d9d-ac41-f5ad7bb317ac-1691992100885-915e922dbfc7bc8210cbca2487af4b59.jpg',
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
	types={$themeConfigStore.insurance.searchFormBanner}
	{data}
	title="Search and book cheap insurance here!!"
	fullscreen={$themeConfigStore.insurance.searchForm === 'compact'}
>
	{#snippet content()}
		{#if $themeConfigStore.insurance.searchForm === 'compact'}
			<SearchFormInsurance variant="combination" />
		{:else}
			<SearchFormInsurance variant="default" />
			<LastSearchInsurance type="default" />
		{/if}
	{/snippet}
	{#snippet lastSearch()}
		<LastSearchInsurance
			type="combination"
			titleClass={cn({
				'text-primary-foreground': $themeConfigStore.insurance.searchFormBanner.length > 0
			})}
			clearBtnClass={cn({
				'text-primary-foreground': $themeConfigStore.insurance.searchFormBanner.length > 0
			})}
		/>
	{/snippet}
</SearchFormBanner>

<ScrollToTop />
