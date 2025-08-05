<script lang="ts">
	import * as Select from '$lib/components/ui/select';

	const options = [
		{ value: '1', label: 'Last 90 Days' },
		{ value: '2', label: 'Feb 2025' },
		{ value: '3', label: 'Jan 2025' },
		{ value: '4', label: 'Dec 2024' },
		{ value: '5', label: 'Specified Date' }
	];

	let value = $state('1');

	const triggerContent = $derived(options.find((o) => o.value === value)?.label ?? 'Select a date');
</script>

<div>
	<p class="mb-1 text-sm font-semibold">Created Date</p>
	<Select.Root type="single" name="period" bind:value>
		<Select.Trigger class="w-fit">
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
