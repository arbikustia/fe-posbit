<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import * as Card from '$lib/components/ui/card';
	import { formatThousand } from '$lib/helpers/number-helper';

	let myValue = $state('');

	const total = 160000;
	const currency = 'IDR';
</script>

<Card.Root class="overflow-hidden py-0">
	<Card.Content class="p-0">
		<Accordion.Root type="single" bind:value={myValue}>
			<Accordion.Item value="total-fare" class="border-0">
				<Accordion.Trigger class="items-center px-6 hover:bg-gray-100 hover:no-underline">
					<div class="mr-2 flex w-full justify-between text-base font-semibold">
						{#if myValue === 'total-fare'}
							<div>Fare Detail</div>
						{:else}
							<div>Total</div>
							<div>{formatThousand(total)} {currency}</div>
						{/if}
					</div>
				</Accordion.Trigger>
				<Accordion.Content class="space-y-1 px-6">
					<div class="text-muted-foreground flex justify-between">
						<div>Premium</div>
						<div>{formatThousand(135000)} {currency}</div>
					</div>
					<div class="text-muted-foreground flex justify-between">
						<div>Stamp Fee</div>
						<div>{formatThousand(10000)} {currency}</div>
					</div>
					<div class="text-muted-foreground flex justify-between">
						<div>Service Fee</div>
						<div>{formatThousand(15000)} {currency}</div>
					</div>
					<div class="flex justify-between font-semibold">
						<div>Total</div>
						<div>{formatThousand(total)} {currency}</div>
					</div>
				</Accordion.Content>
			</Accordion.Item>
		</Accordion.Root>
	</Card.Content>
</Card.Root>
