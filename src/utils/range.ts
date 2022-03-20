export const range = (start: number, end: number) => {
	const result = [];
	if (start > end) {
		for (let i = start; i >= end; i--) {
			result.push(i);
		}
	} else {
		for (let i = start; i <= end; i++) {
			result.push(i);
		}
	}
	return result;
};
