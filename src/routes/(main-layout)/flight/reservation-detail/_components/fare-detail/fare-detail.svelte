<script lang="ts">
	import { Money } from '$lib/components/icons';
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import { OSGDashSeparator } from '$lib/components/opsigo-ui/dash-separator';
	import * as Card from '$lib/components/ui/card';
	import { Switch } from '$lib/components/ui/switch';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import type { FareDetailProps } from './types';

	let { status, price }: FareDetailProps = $props();
	let showOriginalOnly = $state(false);
</script>

<Card.Root class="border-2 py-0" style="border-color: {bookingStatusColor[status]};">
	<Card.Header class="border-b p-2 !pb-0">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2 font-semibold">
				<Money class="h-6 w-6" />
				Fare Detail
			</div>
			<div class="flex items-center gap-2">
				<div class="text-xs">Show Original Only</div>
				<Switch bind:checked={showOriginalOnly} />
			</div>
		</div>
	</Card.Header>
	<Card.Content class="p-0">
		<div class="p-2">
			<div>
				<!-- <div class="flex items-center justify-between">
					<div>Flight 1: CGK-DPS</div>
					<img
						src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/JT-mail.png"
						alt="airline logo"
						class="h-8 w-8 object-contain"
					/>
				</div> -->
				{#each price.fareDetails as fareDetail}
					<div
						class={cn('flex justify-between text-sm', {
							'text-green-500': fareDetail.code === 'SF'
						})}
					>
						<div>{fareDetail.label}</div>
						<div>{formatThousand(fareDetail.amount)} {price.currency}</div>
					</div>
				{/each}
			</div>
			<!-- <OSGDashSeparator class="my-2 border border-gray-300" />
			<div>
				<div class="flex items-center justify-between">
					<div>Flight 2: CGK-DPS</div>
					<img
						src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/JT-mail.png"
						alt="airline logo"
						class="h-8 w-8 object-contain"
					/>
				</div>
				<div class="flex justify-between text-sm">
					<div>Base Fare</div>
					<div>500,000 IDR</div>
				</div>
				<div class="flex justify-between text-sm">
					<div>VAT</div>
					<div>50,000 IDR</div>
				</div>
				<div class="flex justify-between text-sm text-green-500">
					<div>Service Fee</div>
					<div>50,000 IDR</div>
				</div>
			</div> -->
		</div>
		<div class="border-t p-2">
			<div class="flex justify-between text-sm font-semibold">
				<div>Total</div>
				<div>{formatThousand(price.total)} {price.currency}</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
