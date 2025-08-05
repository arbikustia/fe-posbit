<script lang="ts">
	import { cn } from '$lib/utils';
	import dayjs from 'dayjs';

	const thClass = 'bg-primary py-2 pr-4 text-start text-white';
	const tdClass = 'pr-4 py-1';
</script>

<div class="bg-white">
	<div class="px-4 pt-4">
		<img class="block h-8 w-auto" src="/images/opsigo-logo.png" alt="Opsigo" />
	</div>

	<div class="my-2 px-4">
		<div class="flex items-center justify-between">
			<div class="font-semibold">Train Schedule: Gambir (GMR) → Bandung (BD)</div>

			<p class="text-xs text-muted-foreground">
				Generated on {dayjs().format('dddd, DD MMM YYYY HH:mm')}
			</p>
		</div>
		<div class="flex items-center justify-between text-sm">
			<p>Departure: 11 March 2025</p>
			<p>10 shedules available</p>
		</div>
	</div>
	<div class="px-4 pb-4">
		<table class="rounded-md text-sm">
			<thead>
				<tr>
					<th class={cn(thClass, 'px-2 py-1')}>No</th>
					<th class={thClass}>Train</th>
					<th class={thClass}>Number</th>
					<th class={thClass}>Origin</th>
					<th class={thClass}>Destination</th>
					<th class={thClass}>Duration</th>
					<th class={thClass}>Class</th>
					<th class={cn(thClass, 'text-end')}>Price/pax</th>
				</tr>
			</thead>
			<tbody>
				{#each Array(10) as trip, tripIdx}
					<tr
						class={cn('border-b border-primary', {
							'bg-primary/10': tripIdx % 2 !== 0
						})}
					>
						<td class={cn(tdClass, 'px-2 text-center')}>
							{tripIdx + 1}
						</td>

						<td class={cn(tdClass, 'max-w-24')}>Parahyangan</td>
						<td class={tdClass}> KAI-123 </td>
						<td class={tdClass}> BDG (09:30) </td>
						<td class={tdClass}> GMR (14:30) </td>
						<td class={tdClass}>5h 0m</td>

						<td class={tdClass}> Economy (CD) </td>

						<td class={cn(tdClass, 'text-end font-semibold')}> 180.000 IDR </td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
