import { copyToClipboard, webShare } from '$lib/utils';

export function useShareSchedule() {
	function copySimpleFormat(useShareApi = false) {
		let text = 'Simple Train Schedule Format';

		if (useShareApi) {
			webShare({
				title: 'Train Schedule',
				text
			});

			return;
		}

		copyToClipboard(text);
	}

	function copyRegularFormat(useShareApi = false) {
		let text = `Regular Train Schedule Format`;

		if (useShareApi) {
			webShare({
				title: 'Train Schedule',
				text
			});

			return;
		}

		copyToClipboard(text);
	}

	function copyFormattedFormat(useShareApi = false) {
		let text = `Formatted Train Schedule Format`;

		if (useShareApi) {
			webShare({
				title: 'Train Schedule',
				text
			});

			return;
		}

		copyToClipboard(text);
	}

	return {
		copySimpleFormat,
		copyRegularFormat,
		copyFormattedFormat
	};
}
