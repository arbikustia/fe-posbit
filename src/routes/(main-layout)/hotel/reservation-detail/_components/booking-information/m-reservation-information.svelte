<script lang="ts">
	let isExpanded = false;

	const reservationData = {
		bookingCode: 'HT25E02KU2DDB0KYK',
		timeLimit: '22 Sep 2025 · 15:23 (UTC+7)',
		timeLimitRelative: '3 days ago',
		cancellationCharge: '22 Sep 2025 · 15:23 (UTC+7)',
		cancellationChargeRelative: '3 days from now',
		additionalNotes: 'Free cancellation available until 20 Sep 2025'
	};

	const toggleCard = () => {
		isExpanded = !isExpanded;
	};
</script>

<div class="mx-auto mt-16 max-w-md">
	<!-- Card Container -->
	<div class="overflow-hidden">
		<!-- Card Header -->
		<button class="flex w-full items-center justify-between px-4 py-3" on:click={toggleCard}>
			<h2 class="text-lg font-semibold text-gray-900">Reservation Information</h2>
			<svg
				class={`h-5 w-5 text-gray-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
			>
				<path
					fill-rule="evenodd"
					d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>

		<!-- Always Visible Content -->
		<div class="">
			<!-- Booking Code -->
			<div class="flex items-start bg-white px-3 py-2">
				<div class="w-1/3 text-sm font-medium text-gray-500">Booking Code</div>
				<div class="w-2/3 text-sm font-semibold text-blue-600">{reservationData.bookingCode}</div>
			</div>

			<div class="flex items-start px-3 py-2">
				<div class="w-1/3 text-sm font-medium text-gray-500">Booking ID</div>
				<div class="w-2/3 text-sm text-gray-600">{reservationData.timeLimitRelative}</div>
			</div>

			<div class="flex items-start bg-white px-3 py-2">
				<div class="w-1/3 text-sm font-medium text-gray-500">Source Reference</div>
				<div class="w-2/3 text-sm text-gray-600">
					{reservationData.cancellationChargeRelative}
				</div>
			</div>
		</div>

		<!-- Expanded Content -->
		{#if isExpanded}
			<div class="">
				<div class="flex items-start px-3 py-2">
					<div class="w-1/3 text-sm font-medium text-gray-500">Source</div>
					<div class="w-2/3 text-sm text-gray-600">
						<div class="text-sm text-gray-900">{reservationData.timeLimit}</div>
						<div class="text-xs text-gray-500">{reservationData.timeLimitRelative}</div>
					</div>
				</div>

				<div class="flex items-start bg-white px-3 py-2">
					<div class="w-1/3 text-sm font-medium text-gray-500">Time Limit</div>
					<div class="w-2/3 text-sm text-gray-600">
						{reservationData.cancellationChargeRelative}
					</div>
				</div>

				<!-- Time Limit Preview -->
				<div class="flex items-start border-t border-gray-100 px-3 py-2">
					<div class="w-1/3 text-sm font-medium text-gray-500">Cancellation Charge</div>
					<div class="w-2/3 text-sm text-gray-600">{reservationData.timeLimitRelative}</div>
				</div>

				<!-- Cancellation Preview -->
				<div class="flex items-start bg-white px-3 py-2">
					<div class="w-1/3 text-sm font-medium text-gray-500">Invoice Status</div>
					<div class="w-2/3 text-sm text-gray-600">Not Posted</div>
				</div>

				<div class="flex items-start px-3 py-2">
					<div class="w-1/3 text-sm font-medium text-gray-500">Invoice No</div>
					<div class="w-2/3 text-sm text-gray-600"></div>
				</div>
			</div>
		{/if}
	</div>
</div>
