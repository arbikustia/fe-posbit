import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const currentUser = event.locals.currentUser;

	return { currentUser };
};
