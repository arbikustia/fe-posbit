<script lang="ts">
	import { Document } from '$lib/components/icons';
	import { bookingStatusColor, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';

	const remarks = [
		{
			passenger: 'Mr John',
			items: ['Lorem ipsum dolor sit amet', 'Lorem ipsum dolor sit amet']
		},
		{
			passenger: 'Mr John Doe'
		},
		{
			passenger: 'Mrs Pamela Anderson'
		},
		{
			passenger: 'Mr John Wick',
			items: ['Lorem ipsum dolor sit amet']
		}
	];

	let { status }: { status: BookingStatus } = $props();
</script>

<Card.Root class="gap-0 border-2 py-0" style="border-color: {bookingStatusColor[status]};">
	<Card.Header class="pb-0! border-b p-2">
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2 font-semibold">
				<Document class="h-6 w-6" />
				Remark
			</div>
			<Button variant="outline">Edit</Button>
		</div>
	</Card.Header>
	<Card.Content class="p-4">
		{#if remarks.length > 0}
			<div class="space-y-2">
				{#each remarks as remark, i}
					<div class="flex gap-x-2">
						<div>{i + 1}.</div>
						<div class="flex-1 space-y-2">
							<div class="flex items-center justify-between pr-2">
								<p>{remark.passenger}</p>
								{#if !remark.items}
									<p class="text-sm text-gray-500">No remarks</p>
								{/if}
							</div>
							{#if remark.items}
								<div class="rounded-md border text-sm">
									{#each remark.items as remarkItem, remarkItemIdx}
										{@const isLast = remarkItemIdx === remark.items.length - 1}
										<div class="grid grid-cols-12 p-2">
											<div class="col-span-3">
												Remark {remarkItemIdx + 1}
											</div>
											<div class="col-span-9">
												: {remarkItem}
											</div>
										</div>
										{#if !isLast}
											<Separator />
										{/if}
									{/each}
								</div>
							{/if}
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center">
				<p class="text-gray-500">No remark added</p>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
