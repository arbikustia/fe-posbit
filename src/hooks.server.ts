import { getAuthFromCookies } from '$lib/server/auth';
import { injectTheme } from '$lib/server/theme';
import { paraglideMiddleware } from '$lib/paraglide/server';

export async function handle({ event, resolve }) {
	const start = performance.now();
	
	// Bypass hooks untuk api route
	if (event.url.pathname.startsWith('/api')) {
		return resolve(event);
	}

	// Bypass hooks untuk service worker
	if (event.url.pathname.includes('service-worker')) {
		return resolve(event);
	}

	const currentUser = await getAuthFromCookies(event);
	const userAgent = event.request.headers.get('user-agent') || '';
	const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);

	// Handle redirect logic - berikan header cache-control untuk service worker
	if (!currentUser && !event.url.pathname.includes('/auth')) {
		return new Response('Redirect', { 
			status: 303, 
			headers: { 
				'Location': '/auth/login',
				'Cache-Control': 'no-store, no-cache, must-revalidate'
			} 
		});
	}

	if (currentUser && event.url.pathname.includes('/auth')) {
		return new Response('Redirect', { 
			status: 303, 
			headers: { 
				'Location': '/',
				'Cache-Control': 'no-store, no-cache, must-revalidate'
			} 
		});
	}

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
				const inject = injectTheme(event, newHtml);
				console.log('[timing] resolve', performance.now() - start, 'ms');
				return inject;
			}
		});
	});
}