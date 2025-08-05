import { today, getLocalTimeZone, parseDate } from '@internationalized/date';
import type { Preset } from './types';
import dayjs from 'dayjs';

export const lastMonth = dayjs().subtract(1, 'month');
export const lastTwoMonth = dayjs().subtract(2, 'month');

export const presets: Preset[] = [
	{
		id: 'today',
		label: 'Today',
		value: {
			start: today(getLocalTimeZone()),
			end: today(getLocalTimeZone())
		}
	},
	{
		id: 'yesterday',
		label: 'Yesterday',
		value: {
			start: today(getLocalTimeZone()).subtract({ days: 1 }),
			end: today(getLocalTimeZone()).subtract({ days: 1 })
		}
	},
	{
		id: 'last-seven-days',
		label: 'Last 7 Days',
		value: {
			start: today(getLocalTimeZone()).subtract({ days: 7 }),
			end: today(getLocalTimeZone())
		}
	},
	{
		id: 'last-thirty-days',
		label: 'Last 30 Days',
		value: {
			start: today(getLocalTimeZone()).subtract({ days: 30 }),
			end: today(getLocalTimeZone())
		}
	},
	{
		id: 'current-month',
		label: dayjs().format('MMMM YYYY'),
		value: {
			start: parseDate(dayjs().startOf('month').format('YYYY-MM-DD')),
			end: today(getLocalTimeZone())
		}
	},
	{
		id: 'last-month',
		label: lastMonth.format('MMMM YYYY'),
		value: {
			start: parseDate(lastMonth.startOf('month').format('YYYY-MM-DD')),
			end: parseDate(lastMonth.endOf('month').format('YYYY-MM-DD'))
		}
	},
	{
		id: 'last-two-month',
		label: lastTwoMonth.format('MMMM YYYY'),
		value: {
			start: parseDate(lastTwoMonth.startOf('month').format('YYYY-MM-DD')),
			end: parseDate(lastTwoMonth.endOf('month').format('YYYY-MM-DD'))
		}
	}
];
