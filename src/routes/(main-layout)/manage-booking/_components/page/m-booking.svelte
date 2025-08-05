<script lang="ts">
	import { MOSGPresetDatePicker } from '$lib/components/opsigo-ui/preset-date-picker';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import type { DateRange } from 'bits-ui';
	import { MBookingItem } from '../booking-item';

	const bookingData = [
		{
			type: 'flight',
			merchant: 'PT. Reka Sinergi Pratama',
			amount: 123000,
			currency: 'IDR',
			provider: 'Garuda Indonesia',
			location: {
				from: {
					name: 'Jakarta',
					code: 'CGK'
				},
				to: {
					name: 'Surabaya',
					code: 'SUB'
				}
			},
			details: {
				date: 'Tue, 3 Jun 2025',
				time: '10:00',
				guests: 2
			},
			bookingInfo: {
				status: 'reserved',
				code: 'AHFKSD'
			}
		},
		{
			type: 'hotel',
			merchant: 'PT. Reka Sinergi Pratama',
			amount: 123000,
			currency: 'IDR',
			provider: 'DoubleTree by Hilton Jakarta - Diponegoro',
			location: {
				from: {
					name: 'Jakarta'
				}
			},
			details: {
				date: 'Tue, 3 Jun 2025',
				duration: '1 night'
			},
			bookingInfo: {
				status: 'reserved',
				code: 'HTL123'
			}
		},
		{
			type: 'train',
			merchant: 'PT. Reka Sinergi Pratama',
			amount: 123000,
			currency: 'IDR',
			provider: 'KAI (Kereta Api Indonesia)',
			location: {
				from: {
					name: 'Jakarta',
					code: 'GMR'
				},
				to: {
					name: 'Surabaya',
					code: 'SUB'
				}
			},
			details: {
				date: 'Tue, 3 Jun 2025',
				time: '08:00',
				guests: 2,
				additionalInfo: ''
			},
			bookingInfo: {
				status: 'reserved',
				code: 'TRN456'
			}
		},
		{
			type: 'insurance',
			merchant: 'PT. Reka Sinergi Pratama',
			amount: 123000,
			currency: 'IDR',
			provider: 'Zurich Travel Insurance - Basic (Individual)',
			location: {
				from: {
					name: 'Germany'
				}
			},
			details: {
				date: '3 Dec 2025',
				guests: 2,
				additionalInfo: ''
			},
			bookingInfo: {
				status: 'reserved',
				code: 'INS789'
			}
		}
	];

	let dateFilterValue = $state<DateRange>({
		start: undefined,
		end: undefined
	});
</script>

<div class="p-3">
	<h1 class="mb-4 text-xl font-semibold">Manage Booking</h1>
	<div class="flex flex-col gap-y-3">
		<div class="w-full">
			<p class="mb-1 text-sm font-semibold">Created Date</p>
			<MOSGPresetDatePicker bind:value={dateFilterValue} title="Select Created Date" />
		</div>
		<div class="flex flex-col items-end justify-start gap-4 overflow-auto p-1">
			<Button
				variant="link"
				class="p-0 text-black hover:no-underline"
				role="combobox"
				title="Advance Filter"
			>
				Advance Filter
				<ChevronDown class="opacity-50" />
			</Button>
			<!-- <FilterCategory /> -->
		</div>

		<div class="flex items-center justify-between gap-2">
			<Input placeholder="Search.." class="" />
			<!-- <FilterDate /> -->
		</div>
		<MBookingItem {bookingData} />
	</div>
</div>
