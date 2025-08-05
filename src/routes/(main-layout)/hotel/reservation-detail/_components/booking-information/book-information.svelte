<script>
	import Icon from '@iconify/svelte';

	const bookingInfo = {
		bookingCode: 'HNDJE1JA123',
		bookingId: 'HNDJE1JA123',
		sourceReference: 'HNDJE1JA123',
		source: 'HSCM',
		bookingStatus: 'Confirmed',
		timeLimit: '22 Sep 2025 · 15:23 (UTC+7)',
		countdown: '3 day from now',
		cancellationCharge: 'N/A',
		invoiceStatus: 'POSTED',
		invoiceNo: '-'
	};

	const footerInfo = {
		bookedBy: 'John Doe',
		company: 'PT. Reka Sinergi Pratama',
		bookingDate: '22 Sep 2025 · 15:23 (UTC+7)',
		lastSync: '22 Sep 2025 · 16:23 (UTC+7)',
		syncAgo: '10 minutes ago'
	};
</script>

<!-- MAIN BOX -->
<p class="flex items-center gap-2 pb-3">
	<Icon icon="ph:buildings" width="20" height="20" style="color: #6c6c6c" />
	<span class="font-bold">RSP (Reka SInergi Pratama, PT)</span>
</p>
<div class="mb-5 w-full space-y-4 rounded-md border border-gray-200 bg-white text-sm shadow-md">
	<div class="flex flex-col gap-y-2">
		<div class="flex w-full items-center px-4 pt-2">
			<div class="w-[30%] font-medium">Booking Code</div>
			<div class="col-span-2 font-bold">{bookingInfo.bookingCode}</div>
		</div>

		<div class="flex w-full items-center bg-gray-300/20 px-4 py-1">
			<div class="w-[30%] font-medium">Booking ID</div>
			<div class="col-span-2">{bookingInfo.bookingId}</div>
		</div>

		<div class="flex w-full items-center px-4">
			<div class="w-[30%] font-medium">Source Reference</div>
			<div class="col-span-2">{bookingInfo.sourceReference}</div>
		</div>

		<div class="flex w-full items-center bg-gray-300/20 px-4 py-1">
			<div class="w-[30%] font-medium">Source</div>
			<div class="col-span-2 cursor-pointer font-bold text-blue-400">{bookingInfo.source}</div>
		</div>

		<div class="flex w-full items-center px-4">
			<div class="w-[30%] font-medium">Booking Status</div>
			<div class="col-span-2 flex items-center rounded-lg border border-gray-400 px-1">
				<span class="h-2 w-2 rounded-full bg-green-500"></span>
				<span class="rounded-md px-2 py-0.5 text-xs">
					{bookingInfo.bookingStatus}
				</span>
			</div>
		</div>

		<div class="flex w-full items-center bg-gray-300/20 px-4 py-1">
			<div class="w-[30%] font-medium">Time Limit</div>
			<div class="col-span-2 flex w-[70%] justify-between">
				<span>{bookingInfo.timeLimit}</span>
				<span class="text-xs text-gray-400">{bookingInfo.countdown}</span>
			</div>
		</div>
		<div class="flex w-full items-center px-4">
			<div class="w-[30%] font-medium">Cancellation charge</div>
			<div class="col-span-2">{bookingInfo.cancellationCharge}</div>
		</div>

		<div class="flex w-full items-center bg-gray-300/20 px-4 py-1">
			<div class="w-[30%] font-medium">Invoice Status</div>
			<div class="col-span-2 font-bold uppercase">{bookingInfo.invoiceStatus}</div>
		</div>
		<div class="flex w-full items-center px-4 pb-2">
			<div class="w-[30%] font-medium">Invoice No.</div>
			<div class="col-span-2 text-gray-400">{bookingInfo.invoiceNo}</div>
		</div>
	</div>
</div>

<!-- FOOTER BOX -->
<div class="mt-3 w-full space-y-2 rounded-md border border-gray-200 bg-white text-sm shadow-md">
	<div class="flex w-full items-center px-4 pt-2">
		<div class="w-[30%] font-medium">Booked by</div>
		<div class="col-span-2 flex w-[70%] justify-between">
			<span>{footerInfo.bookedBy}</span>
			<span class="text-xs text-gray-400">{footerInfo.company}</span>
		</div>
	</div>

	<div class="flex w-full items-center bg-gray-300/20 px-4 py-1">
		<div class="w-[30%] font-medium">Booking date</div>
		<div class="col-span-2">{footerInfo.bookingDate}</div>
	</div>

	<div class="flex w-full items-center px-4 pb-2">
		<div class="w-[30%] font-medium">Last Sync</div>
		<div class="col-span-2 flex w-[70%] justify-between">
			<span>{footerInfo.lastSync}</span>
			<span class="text-xs text-gray-400">{footerInfo.syncAgo}</span>
		</div>
	</div>
</div>
