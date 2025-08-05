import { getLocale, setLocale, type Locale } from '$lib/paraglide/runtime';

function useLanguageSwitch() {
	let currentLang = getLocale();

	function switchLanguage(lang: Locale) {
		setLocale(lang);
	}

	return { currentLang, switchLanguage };
}

export { useLanguageSwitch };
