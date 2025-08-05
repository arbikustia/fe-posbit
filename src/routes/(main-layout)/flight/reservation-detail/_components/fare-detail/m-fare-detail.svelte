<script lang="ts">
	import Close from '$lib/components/icons/close.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Separator } from '$lib/components/ui/separator';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { ChevronUp } from '@lucide/svelte';
	import type { FareDetailProps } from './types';
	import { cn } from '$lib/utils';

	let { price }: Pick<FareDetailProps, 'price'> = $props();
	let open = $state(false);
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger>
		<div>
			<button class="flex items-center gap-x-1">
				<p class="text-sm">Total</p>
				<ChevronUp class="h-5 w-5" />
			</button>
			<p class="font-semibold">
				{formatThousand(price.total)}
				{price.currency}
			</p>
		</div>
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="max-h-[70lvh] overflow-y-auto" data-vaul-no-drag>
			<div class="sticky top-0">
				<div class="flex items-center justify-between bg-white p-4 pt-1">
					<div>
						<p class="font-semibold">
							Fare Detail - <span class="text-sm font-normal text-gray-400"
								>origin from airline</span
							>
						</p>
					</div>
					<button onclick={() => (open = false)}>
						<Close />
					</button>
				</div>
				<Separator />
			</div>

			<div class="p-4">
				{#each price.fareDetails as fareDetail}
					<div
						class={cn('flex justify-between', {
							'text-green-500': fareDetail.code === 'SF'
						})}
					>
						<div>{fareDetail.label}</div>
						<div>{formatThousand(fareDetail.amount)} {price.currency}</div>
					</div>
				{/each}
				<!-- <div>
					<div class="mb-2 flex items-center justify-between">
						<p>Flight 1: CGK-DPS</p>
						<img
							class="max-h-[24px] object-contain"
							src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/JT-mail.png"
							alt="Airline Logo"
						/>
					</div>
					<div class="flex items-center justify-between">
						<p>BaseFare</p>
						<p>{formatThousand(500000)} IDR</p>
					</div>
					<div class="flex items-center justify-between">
						<p>VAT</p>
						<p>{formatThousand(50000)} IDR</p>
					</div>
					<div class="flex items-center justify-between font-semibold">
						<p>Total</p>
						<p>{formatThousand(550000)} IDR</p>
					</div>
				</div>
				<div class="my-4 border border-dashed"></div>
				<div>
					<div class="mb-2 flex items-center justify-between">
						<p>Flight 2: CGK-DPS</p>
						<img
							class="max-h-[24px] object-contain"
							src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/JT-mail.png"
							alt="Airline Logo"
						/>
					</div>
					<div class="flex items-center justify-between">
						<p>BaseFare</p>
						<p>{formatThousand(500000)} IDR</p>
					</div>
					<div class="flex items-center justify-between">
						<p>VAT</p>
						<p>{formatThousand(50000)} IDR</p>
					</div>
					<div class="flex items-center justify-between font-semibold">
						<p>Total</p>
						<p>{formatThousand(550000)} IDR</p>
					</div>
				</div> -->
			</div>
			<Separator />
			<div class="p-4">
				<div class="flex items-center justify-between font-semibold">
					<p>Total</p>
					<p>{formatThousand(price.total)} {price.currency}</p>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
