<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import type { FlightClass, Trip } from '$lib/types/FlightResponse';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';

	type FareDetailCardProps = {
		flightClasses: FlightClass[];
		trips: Trip[];
		useAccordion?: boolean;
	};

	let { flightClasses, trips, useAccordion = true }: FareDetailCardProps = $props();

	let myValue = $state('');

	const currency = $derived(flightClasses?.[0]?.fare.currency);

	const total = $derived(
		flightClasses.reduce((sum, flightClass) => {
			const fareTotal = flightClass.fare.total;
			return sum + fareTotal;
		}, 0)
	);
</script>

{#snippet fareDetail()}
	<div class="space-y-4">
		{#each flightClasses as flighClass, i}
			<div class="space-y-1">
				{#if flightClasses.length > 1}
					<div class="font-semibold">
						{trips[i].origin.airport.code} → {trips[i].destination.airport.code}
					</div>
				{/if}
				<div
					class={cn({
						'ml-2': flightClasses.length > 1
					})}
				>
					{#each flighClass.fare.paxFares as paxFare}
						<div class="text-muted-foreground flex justify-between">
							<div>{paxFare.paxCount}x {paxFare.paxType}</div>
							<div>{formatThousand(paxFare.total)} {paxFare.base.currency}</div>
						</div>
					{/each}
					<div class="text-muted-foreground flex justify-between">
						<div>Tax</div>
						<div>{formatThousand(50000)} {currency}</div>
					</div>
					<div class="text-muted-foreground flex justify-between">
						<div>Service Fee</div>
						<div>{formatThousand(15000)} {currency}</div>
					</div>
				</div>
			</div>
		{/each}
		<div class="flex justify-between font-semibold">
			<div>Total</div>
			<div>{formatThousand(total)} {currency}</div>
		</div>
	</div>
{/snippet}

{#if useAccordion}
	<Card.Root class="overflow-hidden py-0">
		<Card.Content class="p-0">
			<Accordion.Root type="single" bind:value={() => myValue, (newValue) => (myValue = newValue)}>
				<Accordion.Item value="total-fare" class="border-0">
					<Accordion.Trigger class="px-6 hover:bg-gray-100 hover:no-underline">
						<div class="mr-2 flex w-full justify-between text-base font-semibold">
							{#if myValue === 'total-fare'}
								<div>Fare Detail</div>
							{:else}
								<div>Total</div>
								<div>{formatThousand(total)} {currency}</div>
							{/if}
						</div>
					</Accordion.Trigger>
					<Accordion.Content class="px-6">{@render fareDetail()}</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
{:else}
	<Card.Root class="overflow-hidden p-0">
		<Card.Content class="p-4">
			<p class="mb-4 font-semibold">Fare Detail</p>
			{@render fareDetail()}
		</Card.Content>
	</Card.Root>
{/if}
