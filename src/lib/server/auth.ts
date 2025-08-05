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
	const { token, refreshToken, user, tokenExpirationInstant } = response;

	if (!token || !user || !tokenExpirationInstant) {
		throw new Error('Auth Failed, please contact Administrator');
	}

	// Simpan access token ke cookie (JWT)
	event.cookies.set(authTokenCookieKey, token, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'lax',
		expires: new Date(tokenExpirationInstant)
	});

	// Simpan refresh token ke cookie
	event.cookies.set(refreshTokenCookieKey, refreshToken, {
		httpOnly: true,
		path: '/',
		secure: true,
		sameSite: 'lax',
		maxAge: 60 * 60 * 24 * 30 // 30 hari
	});

	const userInfo: UserInfo = {
		fullName: response?.user?.fullName,
		email: response.user.email,
		username: response.user.username
	};

	// Simpan user info ke cookie dalam format JSON string
	event.cookies.set(userInfoCookieKey, JSON.stringify(userInfo), {
		httpOnly: false, // Bisa diakses dari client-side
		secure: true,
		path: '/',
		sameSite: 'lax',
		expires: new Date(tokenExpirationInstant)
	});
}

export function deleteAuthCookie(event: RequestEvent): void {
	event.cookies.delete(authTokenCookieKey, { path: '/' });
	event.cookies.delete(refreshTokenCookieKey, { path: '/' });
	event.cookies.delete(userInfoCookieKey, { path: '/' });
}

export async function login(event: RequestEvent, username: string, password: string) {
	const res = await fetch('https://dev-fusionauth.opsinfra.net/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-FusionAuth-TenantId': 'cf1ffd7a-f1b4-44a9-8a26-9efb443c3976',
			Authorization: 'ChOg7otfBPUl9rncuautOwSJ7_9x6FzIeNocBX08rkUi4qn1hZXlZ_Bd'
		},
		body: JSON.stringify({
			loginId: username,
			password: password,
			applicationId: 'e0cef9f7-5978-4f52-b4f1-30af50969c6f',
			noJWT: false
		})
	});

	if (res.status === 404) {
		throw new Error('Invalid username or password');
	}

	const data = await res.json();
	setAuthCookie(event, data);
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
