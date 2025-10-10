import { fail, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import { zod } from 'sveltekit-superforms/adapters';
import { loginSchema } from './schema';
import { isRedirect, redirect } from '@sveltejs/kit';
import { login } from '$lib/server/auth';

export const load: PageServerLoad = async () => {
	return {
		form: await superValidate(zod(loginSchema))
	};
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(loginSchema));
		let success = false;

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			await login(event, form.data.username, form.data.password);
			success = true;
		} catch (error) {
			if (!isRedirect(error)) {
				return fail(500, {
					form,
					message: (error as Error)?.message ?? 'Internal Server Error'
				});
			}
		}

		if (success) {
			return redirect(302, '/dashboard');
		}
	}
};
