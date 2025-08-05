export function capitalizeEachWord(str: string) {
	return str
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

export function isNumericOnly(str: string) {
	return /^[0-9]+$/.test(str);
}
