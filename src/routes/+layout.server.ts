import type { LayoutServerLoad } from './$types';


export const load: LayoutServerLoad = async (event) => {
	const isMobile = event.locals.isMobile;

	return {
		isMobile
	};
};
