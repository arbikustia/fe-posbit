<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	export let dataGuest;

	let guests = 2;
	let rooms = 1;
	$: triggerLabel = `${guests} Guest${guests > 1 ? 's' : ''}, ${rooms} Room`;

	const increase = (key: 'guests' | 'rooms') => {
		if (key === 'guests') guests += 1;
		if (key === 'rooms') rooms += 1;
	};

	const decrease = (key: 'guests' | 'rooms') => {
		if (key === 'guests' && guests > 1) guests -= 1;
		if (key === 'rooms' && rooms > 1) rooms -= 1;
	};
</script>

<Drawer.Root>
	<Drawer.Trigger class={cn(buttonVariants({ variant: 'secondary' }), 'flex w-full text-primary justify-start')}>
		<Icon  icon="fa6-solid:person" width="25" height="30" class="text-primary ml-1" />
		{triggerLabel}
	</Drawer.Trigger>
	<Drawer.Content>
		<div class="mx-auto w-full max-w-sm">
			<Drawer.Header>
				<Drawer.Title>Guest & Room Selection</Drawer.Title>
				<Drawer.Description>Select number of guests and rooms</Drawer.Description>
			</Drawer.Header>

			<div class="p-4">
				<div class="grid gap-4">
					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<span class="text-lg">
								<Icon
									icon="fa6-solid:person"
									width="25"
									height="30"
									class="text-muted-foreground"
								/>
							</span>
							<span class="font-medium">Adult(s)</span>
						</div>
						<div class="flex items-center space-x-4">
							<button
								on:click={() => decrease('guests')}
								class="flex size-8 items-center justify-center rounded-full border border-gray-300 disabled:opacity-50"
								disabled={guests <= 1}>-</button
							>
							<span class="w-8 text-center">{guests}</span>
							<button
								on:click={() => increase('guests')}
								class="flex size-8 items-center justify-center rounded-full border border-gray-300"
								>+</button
							>
						</div>
					</div>

					<div class="flex items-center justify-between">
						<div class="flex items-center space-x-2">
							<span class="text-lg"
								><Icon icon="cbi:roomsbedroom" width="32" height="32"  style="color: #5e5d5d" /></span
							>
							<span class="font-medium">Room(s)</span>
						</div>
						<div class="flex items-center space-x-4">
							<button
								on:click={() => decrease('rooms')}
								class="flex size-8 items-center justify-center rounded-full border border-gray-300 disabled:opacity-50"
								disabled={rooms <= 1}>-</button
							>
							<span class="w-8 text-center">{rooms}</span>
							<button
								on:click={() => increase('rooms')}
								class="flex size-8 items-center justify-center rounded-full border border-gray-300"
								>+</button
							>
						</div>
					</div>
				</div>
			</div>

			<Drawer.Footer>
				<Drawer.Close
					class={buttonVariants({ variant: 'default', class: 'w-full' })}
					onclick={() => dataGuest(guests, rooms)}
				>
					Apply Selection
				</Drawer.Close>
			</Drawer.Footer>
		</div>
	</Drawer.Content>
</Drawer.Root>
