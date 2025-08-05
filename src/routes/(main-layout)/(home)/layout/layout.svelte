<script lang="ts">
	import Greeting from '../_components/greetings.svelte';
	import TodaysReport from '../_components/todays-report.svelte';
	import BookingsByProduct from '../_components/bookings-by-product.svelte';
	import BookingsByStatus from '../_components/boookings-by-status.svelte';
	import ActionTabs from '../_components/actions-tabs.svelte';
</script>

<div class="container">
	<Greeting />
	<div class="dashboard-container space-y-10 py-10">
		<div class="space-y-3">
			<TodaysReport />
			<div class="grid grid-cols-2 gap-3">
				<BookingsByProduct />
				<BookingsByStatus />
			</div>
		</div>
		<ActionTabs />
	</div>
</div>
