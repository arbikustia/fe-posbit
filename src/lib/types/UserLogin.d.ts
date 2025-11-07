export type UserLogin = {
	userInfo: UserInfo;
	token: string | null;
	refreshToken: string | null;
};

export type UserInfo = {
	fullName: string;
	username: string;
	email: string;
	role: string;
};
