<script>
	export let flightDetails = {
		flightNumber: 'AB1234',
		departure: 'New York (JFK)',
		arrival: 'Los Angeles (LAX)',
		departureTime: '2023-10-15 08:00',
		arrivalTime: '2023-10-15 11:00',
		duration: '6h',
		airline: 'Airways'
	};
</script>

<div class="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-md">
	<h1 class="mb-4 text-2xl font-bold">Flight Summary</h1>
	<div class="mb-4">
		<h2 class="text-xl font-semibold">Flight Details</h2>
		<p class="mt-2"><strong>Flight Number:</strong> {flightDetails.flightNumber}</p>
		<p><strong>Airline:</strong> {flightDetails.airline}</p>
		<p><strong>Departure:</strong> {flightDetails.departure}</p>
		<p><strong>Arrival:</strong> {flightDetails.arrival}</p>
		<p><strong>Departure Time:</strong> {flightDetails.departureTime}</p>
		<p><strong>Arrival Time:</strong> {flightDetails.arrivalTime}</p>
		<p><strong>Duration:</strong> {flightDetails.duration}</p>
	</div>
	<button class="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
		>Confirm Booking</button
	>
</div>
