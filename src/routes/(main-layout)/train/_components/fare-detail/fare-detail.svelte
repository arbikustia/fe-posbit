<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';

	type FareDetailProps = {
		useAccordion?: boolean;
	};

	let { useAccordion = true }: FareDetailProps = $props();

	let myValue = $state('');

	const currency = 'IDR';
	const total = 4000000;
</script>

{#snippet fareDetail()}
	<div class="space-y-4">
		<div class="space-y-1">
			<div class="font-semibold">GMR → BD</div>

			<div class={cn('ml-2')}>
				<div class="text-muted-foreground flex justify-between">
					<div>3 Pax</div>
					<div>{formatThousand(2000000)} {currency}</div>
				</div>

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
		<div class="space-y-1">
			<div class="font-semibold">BD → GMR</div>

			<div class={cn('ml-2')}>
				<div class="text-muted-foreground flex justify-between">
					<div>3 Pax</div>
					<div>{formatThousand(2000000)} {currency}</div>
				</div>

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
					<Accordion.Trigger class="px-3 hover:bg-gray-100 hover:no-underline">
						<div class="mr-2 flex w-full justify-between text-base font-semibold">
							{#if myValue === 'total-fare'}
								<div>Fare Detail</div>
							{:else}
								<div>Total</div>
								<div>{formatThousand(total)} {currency}</div>
							{/if}
						</div>
					</Accordion.Trigger>
					<Accordion.Content class="px-3">{@render fareDetail()}</Accordion.Content>
				</Accordion.Item>
			</Accordion.Root>
		</Card.Content>
	</Card.Root>
{:else}
	<Card.Root class="overflow-hidden p-0">
		<Card.Content class="p-4">
			{@render fareDetail()}
		</Card.Content>
	</Card.Root>
{/if}
