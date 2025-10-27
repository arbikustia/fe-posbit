import { getAuthFromCookies } from '$lib/server/auth';
import { injectTheme } from '$lib/server/theme';
import { paraglideMiddleware } from '$lib/paraglide/server';

export async function handle({ event, resolve }) {
	const currentUser = getAuthFromCookies(event);
	const userAgent = event.request.headers.get('user-agent') || '';
	const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

	// if (!currentUser && !event.url.pathname.includes('/auth')) {
	// 	return new Response('Redirect', { status: 303, headers: { Location: '/auth/login' } });
	// }

	// if (currentUser && event.url.pathname.includes('/auth')) {
	// 	return new Response('Redirect', { status: 303, headers: { Location: '/' } });
	// }

	// for client side
	if (!currentUser) {
		event.locals.currentUser = null;
	} else {
		event.locals.currentUser = currentUser;
	}

	event.locals.isMobile = isMobile;

	// middleware execution order: i18n → theme injection → response
	return paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				const newHtml = html.replace('%lang%', locale);
				return injectTheme(event, newHtml);
			}
		});
	});
}
