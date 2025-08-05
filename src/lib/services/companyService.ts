import type { Company } from '$lib/types/Company';
import dummy from '$lib/dummy/company-complete.json';

export const companyService = {
	getAll: async (): Promise<Company[]> => {
		//await new Promise((resolve) => setTimeout(resolve, 3000));
		return dummy.data;
	}
};
