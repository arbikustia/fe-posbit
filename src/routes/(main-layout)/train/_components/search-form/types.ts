import type { SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';

export type SearchFormValidation = {
	isInvalidRoute: boolean;
	isInvalidCompany: boolean;
};

export type SearchFormState = {
	searchModel: SearchTrainParam;
	isSubmitted: boolean;
	validation: SearchFormValidation;
};
