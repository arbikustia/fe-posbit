export type SearchFormBannerType = 'image' | 'carousel';
export type SearchFormType = 'default' | 'compact';

export type ThemeConfig = {
	color: string;
	radius: number;
	navbar: number;
	font:
		| 'Default'
		| 'Roboto'
		| 'Open Sans'
		| 'Inter'
		| 'Poppins'
		| 'Lato'
		| 'Montserrat'
		| 'Raleway';
	navigation: 'navbar' | 'sidebar';
	sidebar: number;
	navigationColor: string;
	logoType: string;
	flight: {
		searchForm: SearchFormType;
		searchFormBanner: SearchFormBannerType[];
	};
	hotel: {
		searchForm: SearchFormType;
		searchFormBanner: SearchFormBannerType[];
	};
	train: {
		searchForm: SearchFormType;
		searchFormBanner: SearchFormBannerType[];
	};
	insurance: {
		searchForm: SearchFormType;
		searchFormBanner: SearchFormBannerType[];
	};
};
