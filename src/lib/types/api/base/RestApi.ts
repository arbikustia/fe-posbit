export type RestApiResponse<T> = {
    status: any;
	data: T;
	errors: { code: string; message: string }[];
	isFailure: boolean;
	isSuccess: boolean;
};
