<script lang="ts">
	import { themeConfigStore } from '$lib/stores/themeConfigStore';
	import { cn } from '$lib/utils';
	import { SearchFormBanner } from '../../../(component)/search-form-banner';
	import { ScrollToTop } from '../../detail/_components/scroll-to-top';
	import PreviousStay from '../previous-stay/previous-stay.svelte';
	import SearchHotelPanel from '../search-hotel-panel/search-hotel-panel.svelte';

	const data = {
		bannerImg:
			'https://s-light.tiket.photos/t/01E25EBZS3W0FY9GTG6C42E1SE/rsfit19201280gsm/test-discovery/2023/02/15/c7e10e29-649b-4a6b-b849-7b19d227e082-1676433891189-4e9bab8a55f485d8a589fb9674f83057.jpg',
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
	types={$themeConfigStore.hotel.searchFormBanner}
	{data}
	title="Search and book cheap hotel here!!"
	fullscreen={$themeConfigStore.hotel.searchForm === 'compact'}
>
	{#snippet content()}
		{#if $themeConfigStore.hotel.searchForm === 'compact'}
			<SearchHotelPanel variant="combination" />
		{:else}
			<SearchHotelPanel variant="default" />
			<PreviousStay type="default" />
		{/if}
	{/snippet}
	{#snippet lastSearch()}
		<PreviousStay
			type="combination"
			titleClass={cn({
				'text-primary-foreground': $themeConfigStore.hotel.searchFormBanner.length > 0
			})}
			clearBtnClass={cn({
				'text-primary-foreground': $themeConfigStore.hotel.searchFormBanner.length > 0
			})}
		/>
	{/snippet}
</SearchFormBanner>

<ScrollToTop />
