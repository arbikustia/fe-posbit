<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { TripTimeline } from '../../../_components/trip-timeline';

	let { isOpen = $bindable() }: { isOpen: boolean } = $props();
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="w-[90lvw] rounded-lg border-2 border-primary p-0">
		<Dialog.Header class="bg-primary px-4 py-4 text-center text-primary-foreground">
			<Dialog.Title>Departure Train Detail</Dialog.Title>
		</Dialog.Header>

		<div class="max-h-[80lvh] space-y-4 overflow-y-auto p-4">
			<div>
				<p class="mb-4 text-base font-semibold">Schedule</p>
				<div class="flex justify-center">
					<TripTimeline />
				</div>
			</div>

			<div>
				<div class="space-y-2 text-sm">
					<p class="text-base font-semibold">Important Information</p>
					<div>
						<p class="text-base font-semibold">Check-In</p>
						<ul class="list-disc pl-7">
							<li>
								Boarding passes can be printed at self-service machines at all stations 7 days
								before the train's departure time.
							</li>

							<li>
								For check-in within 24 hours of the train's departure, boarding pass can only be
								printed at the departure station.
							</li>
							<li>
								Passengers can get an electronic boarding pass through this application starting 2
								hours before the train's scheduled departure.
							</li>
						</ul>
					</div>
					<div>
						<p class="text-base font-semibold">Passenger</p>
						<ul class="list-disc pl-7">
							<li>
								Pregnant women who rides a long-distance train must meet the following criteria:
								<ol class="list-inside list-[lower-alpha] pl-5">
									<li>Pregnancy age between 14 and 28 weeks</li>
									<li>In good health</li>
									<li>No complications during pregnancy</li>
									<li>Accompanied by at least one adult passenger</li>
								</ol>
							</li>
							<li>
								Passengers 3 years old and older are considered adults, hence subject to adult
								fares, and will be assigned seats based on their tickets.
							</li>
							<li>
								Passengers under 3 years old are considered Infants and will not be charged a ticket
								fare if they do not take their own seat.
							</li>
							<li>Infant passengers will be charged a ticket fare if they take their own seat.</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>
