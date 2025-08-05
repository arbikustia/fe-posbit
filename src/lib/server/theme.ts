import type { ThemeConfig } from '$lib/types/Theme';
import type { RequestEvent } from '@sveltejs/kit';

export const themeCookieKey = 'theme';

export function getThemeConfig(event: RequestEvent): ThemeConfig | null {
	const themeCookie = event.cookies.get(themeCookieKey);
	if (!themeCookie) return null;

	// avoid crashes from malformed JSON
	try {
		const theme: ThemeConfig = JSON.parse(themeCookie);
		return theme && typeof theme.color === 'string' && typeof theme.radius === 'number'
			? theme
			: null;
	} catch {
		return null;
	}
}

export function injectTheme(event: RequestEvent, html: string): string {
	const theme = getThemeConfig(event);
	if (!theme) return html;

	const themeClass = `theme-${theme.color}`;
	const themeStyle = `--radius: ${theme.radius}rem`;

	//inject theme class and style into body tag
	return html
		.replace(
			/<html([^>]*)?(?:style="([^"]*)")?>/,
			(_, attrs = '', existingStyle = '') =>
				`<html${attrs} style="${existingStyle ? existingStyle + ';' : ''}${themeStyle}">`
		)
		.replace(/<body([^>]*)class="([^"]*)"/, `<body$1class="$2 ${themeClass}"`);
}
