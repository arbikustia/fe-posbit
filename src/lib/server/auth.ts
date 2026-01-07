import type { UserInfo, UserLogin } from '$lib/types/UserLogin';
import { json, type RequestEvent } from '@sveltejs/kit';

export const authTokenCookieKey = 'auth_token';
export const refreshTokenCookieKey = 'refresh_token';
export const userInfoCookieKey = 'user_info';

export function decodeJwt(token: string): { [key: string]: unknown } | null {
	try {
		const [, payloadBase64] = token.split('.');
		const payload = JSON.parse(atob(payloadBase64));
		return payload;
	} catch (err) {
		console.error('Decode JWT Failed:', err);
		return null;
	}
}

export function setAuthCookie(event: RequestEvent, response: any): void {
	const { accessToken, refreshToken, role, fullName, email, username } = response;
	console.log(role, 'niini')
	if (!accessToken) {
		throw new Error('Auth Failed, please contact Administrator');
	}

	event.cookies.set(authTokenCookieKey, accessToken, {
		httpOnly: false,
		path: '/',
		secure: true,
		sameSite: 'lax',
		// expires: new Date(tokenExpirationInstant)
	});

	// Simpan refresh token ke cookie
	event.cookies.set(refreshTokenCookieKey, refreshToken, {
		httpOnly: false,
		path: '/',
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 hari
	});

	const userInfo: UserInfo = {
		fullName: fullName,
		email: email,
		username: username,
		role: role
	};

	// Simpan user info ke cookie dalam format JSON string
	event.cookies.set(userInfoCookieKey, JSON.stringify(userInfo), {
		httpOnly: false, // Bisa diakses dari client-side
		secure: true,
		path: '/',
		sameSite: 'lax',
		// expires: new Date(tokenExpirationInstant)
	});
}

export function deleteAuthCookie(event: RequestEvent): void {
	event.cookies.delete(authTokenCookieKey, { path: '/' });
	event.cookies.delete(refreshTokenCookieKey, { path: '/' });
	event.cookies.delete(userInfoCookieKey, { path: '/' });
}

function deleteClientCookies () {
	// Hapus cookies yang tidak httpOnly
	document.cookie.split(';').forEach((cookie) => {
		const name = cookie.split('=')[0].trim();
		// Hapus dengan berbagai path dan domain
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${window.location.hostname}`;
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
	});

	// Hapus specific cookies
	const cookiesToDelete = ['user_info', 'username', 'theme', 'language'];
	cookiesToDelete.forEach((name) => {
		document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
	});
};

// Fungsi untuk menghapus semua storage
function clearAllStorage () {
	// Local Storage
	localStorage.clear();

	// Session Storage
	sessionStorage.clear();

	// IndexedDB (optional)
	if ('indexedDB' in window) {
		indexedDB.databases?.().then((databases) => {
			databases.forEach((db) => {
				if (db.name) indexedDB.deleteDatabase(db.name);
			});
		});
	}
};

export async function login(event: RequestEvent, username: string, password: string) {

	const res = await fetch('https://bantupos.daalushijab.site/api/authentication', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			username: username,
			password: password,
		})
	});

	if (res.status === 404) {
		throw new Error('Invalid username or password');
	}

	const data = await res.json();
	setAuthCookie(event, data.data);
	console.log(data, 'ini response')
	event.cookies.set('username', username, {
		httpOnly: false,
		path: '/',
		secure: true,
		sameSite: 'lax'
	});
	return data
}

export function logout(event: RequestEvent) {
	if (!event.locals.currentUser) {
		return json({ type: 'error', status: 401, error: 'Not authenticated' });
	}

	deleteAuthCookie(event);

	return json({ type: 'redirect', location: '/auth/login', status: 302 });
}

export function getAuthFromCookies(event: RequestEvent): UserLogin | null {
	const token = event.cookies.get(authTokenCookieKey) || null;

	if (token == null) {
		return null;
	}
	const userLogin: UserLogin = {
		token: token,
		refreshToken: event.cookies.get(refreshTokenCookieKey) || null,
		userInfo: event.cookies.get(userInfoCookieKey)
			? JSON.parse(event.cookies.get(userInfoCookieKey)!)
			: null
	};
	return userLogin;
}
