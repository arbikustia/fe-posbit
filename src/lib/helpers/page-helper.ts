export const currentPage = (url: string) => {
	const parts = url.split('/');
	if (parts.length > 1 && parts[1].length === 2) {
		parts.splice(1, 1);
	}
	return parts.join('/');
};
