const cookieHelper = {
	setItem: <T>(key: string, value: T, days: number): void => {
		let expires = '';
		if (days) {
			const date = new Date();
			date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
			expires = '; expires=' + date.toUTCString();
		}
		document.cookie = `${key}=${JSON.stringify(value) || ''}${expires}; path=/`;
	},
	getItem: <T>(key: string): T | null => {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${key}=`);

		if (parts.length === 2) {
			const val = parts?.pop()?.split(';')[0];
			return val ? JSON.parse(val) : null;
		} else {
			return null;
		}
	},
	removeItem: (key: string): void => {
		document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
	}
};

export default cookieHelper;
