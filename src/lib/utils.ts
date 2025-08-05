import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ThemeConfig } from './types/Theme';
import { toast } from 'svelte-sonner';
import { themeColors } from './registry/themes';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const isBrowser = typeof document !== 'undefined';

export function updateTheme(activeTheme: ThemeConfig) {
	if (!isBrowser) return;
	document.body.classList.forEach((className) => {
		if (className.match(/^theme.*/)) {
			document.body.classList.remove(className);
		}
	});

	if (activeTheme) {
		const docEl = document.documentElement;
		document.body.classList.add(`theme-${activeTheme.color}`);

		const fontDefault = `ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', Segoe UI Symbol, 'Noto Color Emoji'`;
		const fontFamily =
			activeTheme.font === 'Default' ? fontDefault : `'${activeTheme.font}', sans-serif`;
		docEl.style.setProperty('--font-primary', fontFamily);

		docEl.style.setProperty('--radius', `${activeTheme.radius}rem`);

		// set navigation theme
		let navAccent = '#f1f5f9';
		let navForeground = 'oklch(0.145 0 0)';
		let navBackground = 'oklch(0.985 0 0)';
		const navTheme = themeColors.find((e) => e.name === activeTheme.navigationColor);
		if (navTheme) {
			if (!['default', 'yellow'].includes(activeTheme.navigationColor)) {
				navForeground = '#ffffff';
			}
			navBackground = navTheme?.activeColor;
			navAccent = navTheme?.hoverColor;
		}
		docEl.style.setProperty('--sidebar', navBackground);
		docEl.style.setProperty('--sidebar-foreground', navForeground);
		docEl.style.setProperty('--sidebar-accent', navAccent); //warna background ketika Zhover
		docEl.style.setProperty('--sidebar-accent-foreground', navForeground); //warna text ketika hover
	}
}

export function themeSrcLogo(logoType: string) {
	if (logoType === 'white') return '/images/opsigo-white.png';
	return '/images/opsigo-logo.png';
}

export function copyToClipboard(text: string) {
	navigator.clipboard
		.writeText(text)
		.then(() => {
			toast.success('Copied to clipboard');
		})
		.catch((err) => {
			toast.error('Failed to copy to clipboard');
			console.log(err);
		});
}

export async function webShare(shareData: ShareData) {
	if (navigator.canShare(shareData)) {
		await navigator.share(shareData).catch((err) => {
			toast.error(err.message);
			console.log(err);
		});
	} else {
		toast.error('Web Share API is not supported in this browser');
	}
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
