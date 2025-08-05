export function formatThousand(number: number): string {
	return number.toLocaleString('en', {
		notation: 'standard',
		compactDisplay: 'short'
	});
}

export function displayCount(count: number) {
	return count > 0 ? `(${count})` : '';
}
