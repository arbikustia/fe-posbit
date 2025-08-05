<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';

	const options = [
		{ value: 'reserved', label: 'Reserved' },
		{ value: 'ticketed', label: 'Ticketed' },
		{ value: 'expired', label: 'Expired' },
		{ value: 'cancelled', label: 'Cancelled' },
		{ value: 'error', label: 'Error' }
	];

	let value = $state('reserved');

	const triggerContent = $derived(options.find((o) => o.value === value)?.label ?? 'Select a date');
</script>

<div>
	<p class="mb-1 text-sm font-semibold">Status</p>
	<Select.Root type="single" name="period" bind:value>
		<Select.Trigger class={buttonVariants({ variant: 'outline', class: 'font-normal' })}>
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				{#each options as option}
					<Select.Item value={option.value} label={option.label} />
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
</div>
