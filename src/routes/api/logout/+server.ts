import { logout } from '$lib/server/auth';
import { type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = (event) => {
	return logout(event);
};
