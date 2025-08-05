import dayjs from 'dayjs';

export function useSelectSchedule() {
	function getMaxDateValue(trainType: string) {
		let date = dayjs().add(90, 'day');
		if (trainType === 'kcic') {
			date = dayjs().add(15, 'day');
		}
		return date.format('YYYY-MM-DD');
	}

	return { getMaxDateValue };
}
