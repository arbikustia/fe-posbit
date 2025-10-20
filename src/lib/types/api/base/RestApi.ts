export type RestApiResponse<T> = {
	data: T;
	errors: { code: string; message: string }[];
	isFailure: boolean;
	isSuccess: boolean;
};
