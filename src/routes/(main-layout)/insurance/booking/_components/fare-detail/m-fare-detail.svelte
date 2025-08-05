<script>
	import * as Drawer from '$lib/components/ui/drawer';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { ChevronUp } from '@lucide/svelte';

	let open = $state(false);

	const total = 160000;
	const currency = 'IDR';
</script>

<button
	class="flex items-center gap-x-1"
	type="button"
	onclick={() => {
		open = true;
	}}
>
	<p class="font-semibold">
		{formatThousand(total)}
		{currency}
	</p>
	<ChevronUp class="h-5 w-5" />
</button>

<Drawer.Root bind:open>
	<Drawer.Content class="border-none p-0">
		<Drawer.Header>
			<Drawer.Title>Fare Detail</Drawer.Title>
		</Drawer.Header>

		<div class="space-y-2 px-4 pb-4">
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
		</div>
	</Drawer.Content>
</Drawer.Root>
