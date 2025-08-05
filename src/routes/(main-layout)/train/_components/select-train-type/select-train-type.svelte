<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import * as Select from '$lib/components/ui/select';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';

	type SelectTrainTypeProps = {
		value: string;
		isAdult?: boolean;
		variant?: 'default' | 'select';
	};

	const typeOptions = [
		{ label: 'KAI', value: 'kai' },
		{ label: 'Whoosh', value: 'kcic' }
	];

	let { value = $bindable(), variant = 'default' }: SelectTrainTypeProps = $props();

	const triggerContent = $derived.by(() => {
		if (!!value) {
			const selected = typeOptions.find((item) => item.value === value);
			if (selected) {
				return selected.label;
			}
		}

		return 'Select Train Type';
	});
</script>

{#if variant === 'select'}
	<Select.Root type="single" name="train-type" bind:value>
		<Select.Trigger
			class={cn(
				buttonVariants({
					variant: 'ghost',
					class: cn(
						'text-primary hover:text-primary h-fit! [&_svg]:text-primary! flex w-auto justify-start p-0 px-2'
					)
				}),
				'border-none shadow-none focus:ring-0 focus:ring-offset-0'
			)}
		>
			<span><Icon icon="pepicons-pencil:train" class="h-4! w-4!" /></span>
			{triggerContent}
		</Select.Trigger>
		<Select.Content align="start">
			<Select.Group>
				{#each typeOptions as typeOption (typeOption.value)}
					<Select.Item value={typeOption.value} label={typeOption.label}
						>{typeOption.label}</Select.Item
					>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
{:else}
	<ToggleGroup.Root
		bind:value={
			() => value,
			(newValue) => {
				if (newValue !== '') {
					return (value = newValue);
				}
			}
		}
		variant="outline"
		type="single"
		class="eq-toggle-root shadow-none! gap-2"
		loop={false}
	>
		{#each typeOptions as typeOption}
			<ToggleGroup.Item
				value={typeOption.value}
				aria-label={`Toggle ${typeOption.label}`}
				class="eq-toggle-item rounded-full! bg-card! shadow-xs data-[state=on]:before:rounded-full! border-l!"
			>
				{typeOption.label}
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
{/if}
