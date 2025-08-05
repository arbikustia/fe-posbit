<script>
	// You can add reactive variables here if needed
	const bookingData = {
		agent: 'RSP (Reka Sinergi Pratama, PT)',
		company: 'RSP (Reka Sinergi Pratama, PT)',
		bookedBy: 'John Doe',
		bookedByCompany: 'RSP (Reka Sinergi Pratama, PT)',
		bookingDate: '22 Sep 2025 · 15:23 (UTC+7)',
		bookingDateRelative: '3 days ago',
		lastSync: '22 Sep 2025 · 15:23 (UTC+7)',
		lastSyncRelative: '3 days ago'
	};
</script>

<div class="mx-auto max-w-md bg-white">
	<div>
		<!-- Agent Row -->
		<div class="flex items-center gap-5 border-b border-gray-100 px-3 py-2">
			<div class="w-1/3 text-sm font-medium text-gray-500">Agent</div>
			<div class="w-2/3 text-sm font-bold">{bookingData.agent}</div>
		</div>

		<!-- Company Row -->
		<div class="flex items-center gap-5 border-b border-gray-100 bg-gray-500/5 px-3 py-2">
			<div class="w-1/3 text-sm font-medium text-gray-500">Company</div>
			<div class="w-2/3 text-sm font-bold">{bookingData.company}</div>
		</div>

		<!-- Booked By Row -->
		<div class="flex items-center gap-5 border-b border-gray-100 px-3 py-2">
			<div class="w-1/3 text-sm font-medium text-gray-500">Booked By</div>
			<div class="w-2/3">
				<div>{bookingData.bookedBy}</div>
				<div class="text-sm text-gray-500">{bookingData.bookedByCompany}</div>
			</div>
		</div>

		<!-- Booking Date Row -->
		<div class="flex items-center gap-5 border-b border-gray-100 bg-gray-500/5 px-3 py-2">
			<div class="w-1/3 text-sm font-medium text-gray-500">Booking Date</div>
			<div class="w-2/3">
				<div>{bookingData.bookingDate}</div>
				<div class="text-sm text-gray-500">{bookingData.bookingDateRelative}</div>
			</div>
		</div>

		<!-- Last Sync Row -->
		<div class="flex items-center gap-5 px-3 py-2">
			<div class="w-1/3 text-sm font-medium text-gray-500">Last Sync</div>
			<div class="w-2/3">
				<div>{bookingData.lastSync}</div>
				<div class="text-sm text-gray-500">{bookingData.lastSyncRelative}</div>
			</div>
		</div>
	</div>
</div>
