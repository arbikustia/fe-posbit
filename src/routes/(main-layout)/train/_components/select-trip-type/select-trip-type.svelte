<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import * as Select from '$lib/components/ui/select';
	import type { SearchTrainParam } from '$lib/types/app/train/SearchTrainParam';
	import { tripTypes } from './constants';
	import { buttonVariants } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { ArrowRightLeft } from '@lucide/svelte';

	type SelectTripTypeProps = {
		value: SearchTrainParam['tripType'];
		variant?: 'default' | 'select';
		classContent?: string;
		classItem?: string;
		class?: string;
	};

	let {
		value = $bindable(),
		variant = 'default',
		classContent,
		classItem,
		class: className
	}: SelectTripTypeProps = $props();

	const triggerContent = $derived.by(() => {
		if (!!value) {
			const selected = tripTypes.find((item) => item.value === value);
			if (selected) {
				return selected.label;
			}
		}

		return 'Select Trip Type';
	});
</script>

{#if variant === 'select'}
	<Select.Root type="single" name="favoriteFruit" bind:value>
		<Select.Trigger
			class={cn(
				buttonVariants({
					variant: 'ghost',
					class: cn(
						'h-fit! text-primary hover:text-primary [&_svg]:text-primary! flex w-auto justify-start p-0 px-2'
					)
				}),
				'border-none shadow-none focus:ring-0 focus:ring-offset-0'
			)}
		>
			<span><ArrowRightLeft /></span>
			{triggerContent}
		</Select.Trigger>
		<Select.Content align="start">
			<Select.Group>
				{#each tripTypes as tripType (tripType.value)}
					<Select.Item value={tripType.value} label={tripType.label}>{tripType.label}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
{:else}
	<Tabs.Root bind:value class={cn('w-fit', className)}>
		<Tabs.List class={cn(classContent)}>
			{#each tripTypes as type}
				<Tabs.Trigger value={type.value} class={cn('data-[state=active]:text-primary', classItem)}
					>{type.label}</Tabs.Trigger
				>
			{/each}
		</Tabs.List>
	</Tabs.Root>
{/if}
