import { writable } from 'svelte/store';
import type { ThemeConfig } from '$lib/types/Theme';
import cookieHelper from '$lib/helpers/cookie-helper';

export const defaultThemeConfig: ThemeConfig = {
	color: 'default',
	radius: 0.5,
	navbar: 1,
	navigation: 'navbar',
	sidebar: 1,
	font: 'Inter',
	navigationColor: 'default',
	logoType: 'default',
	flight: {
		searchForm: 'default',
		searchFormBanner: []
	},
	hotel: {
		searchForm: 'default',
		searchFormBanner: []
	},
	train: {
		searchForm: 'default',
		searchFormBanner: []
	},
	insurance: {
		searchForm: 'default',
		searchFormBanner: []
	}
};

function createStore() {
	const key = 'theme';
	let storedValue: ThemeConfig | null = null;

	if (typeof window !== 'undefined') {
		storedValue = cookieHelper.getItem<ThemeConfig>(key);
	}

	let parsedValue: ThemeConfig | null = null;
	if (storedValue) {
		parsedValue = storedValue;
	}

	const store = writable<ThemeConfig>(parsedValue ?? defaultThemeConfig);

	store.subscribe((value) => {
		if (typeof window !== 'undefined') {
			cookieHelper.setItem(key, value, 30);
		}
	});

	return {
		subscribe: store.subscribe,
		set: function (theme: ThemeConfig) {
			store.set(theme);
		},
		clear: function () {
			store.set(defaultThemeConfig);
			if (typeof window !== 'undefined') {
				cookieHelper.removeItem(key);
			}
		}
	};
}

export const themeConfigStore = createStore();
