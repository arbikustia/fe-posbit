<script>
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils';
	import { Funnel } from '@lucide/svelte';

	const filterCategories = [
		{
			label: 'General',
			value: 'general'
		},
		{
			label: 'Flight',
			value: 'flight'
		},
		{
			label: 'Hotel',
			value: 'hotel'
		},
		{
			label: 'Train',
			value: 'train'
		},
		{
			label: 'Insurance',
			value: 'insurance'
		}
	];

	let selectedCategory = $state('general');
</script>

{#snippet renderSelect()}
	<Select.Root type="single">
		<Select.Trigger class="w-full">All</Select.Trigger>
		<Select.Content>
			{#each Array(2) as item, i}
				<Select.Item value="item-{i}" label="Item">Item</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
{/snippet}

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants()}>
		<Funnel />
		Advanced Filter (4)
	</Dialog.Trigger>
	<Dialog.Content class="lg:max-w-220">
		<Dialog.Header>
			<Dialog.Title>Advanced Filter</Dialog.Title>
		</Dialog.Header>
		<div class="grid grid-cols-12">
			<div class="col-span-2 flex flex-col gap-2 border-r pr-4">
				{#each filterCategories as category}
					<Button
						variant="ghost"
						class="justify-between p-0 px-2"
						onclick={() => (selectedCategory = category.value)}
					>
						<p
							class={cn('text-muted-foreground', {
								'text-primary': selectedCategory === category.value
							})}
						>
							{category.label}
						</p>
						<!-- <div class="bg-primary text-primary-foreground size-5 rounded-full text-sm">3</div> -->
					</Button>
				{/each}
			</div>
			<div class="col-span-10 pl-4">
				<div class="grid grid-cols-3 gap-4">
					<div>
						<p class="mb-1 text-sm font-semibold">Agent Type</p>
						{@render renderSelect()}
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold">Agent</p>
						{@render renderSelect()}
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold">Company</p>
						{@render renderSelect()}
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold">Invoice Status</p>
						{@render renderSelect()}
					</div>
					<div>
						<p class="mb-1 text-sm font-semibold">Created by</p>
						{@render renderSelect()}
					</div>
				</div>
			</div>
		</div>
		<Dialog.Footer>
			<Button variant="ghost">Reset</Button>
			<Button>Apply</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
