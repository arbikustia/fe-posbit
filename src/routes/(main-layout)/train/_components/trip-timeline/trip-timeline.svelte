<script lang="ts">
	import TripTimelineItem from './trip-timeline-item.svelte';
</script>

<div class="space-y-6">
	<div>
		<!-- DEPARTURE -->
		<TripTimelineItem />

		<!-- TRAIN -->
		<div class="flex w-fit gap-x-4">
			<div class="flex w-28 items-center justify-end py-10 text-end">
				<p class="text-sm text-gray-600">4h 10m</p>
			</div>
			<div class="flex w-2 flex-col items-center">
				<div class="w-px flex-1 bg-gray-400"></div>
			</div>
			<div class="flex-1 py-10">
				<div class="flex items-center gap-3">
					<img
						class="h-8 w-8 object-contain"
						src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/kai.png"
						alt="Train Logo"
					/>
					<div>
						<p class="font-semibold">Argo Parahyangan</p>
						<p class="text-xs text-gray-600">KA - 137</p>
						<p class="text-xs text-gray-600">Economy (A)</p>
					</div>
				</div>
			</div>
		</div>

		<!-- ARRIVAL -->
		<TripTimelineItem isLast />
	</div>
</div>
