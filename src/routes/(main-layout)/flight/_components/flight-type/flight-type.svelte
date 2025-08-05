<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { cn } from '$lib/utils';
	import { flightTypes } from './constants';
	import type { FlightTypeProps } from './types';

	let {
		value = $bindable(),
		type = 'default',
		triggerClass,
		class: className,
		variant
	}: FlightTypeProps & { type?: 'default' | 'select' } = $props();

	const triggerContent = $derived.by(() => {
		if (!!value) {
			const selected = flightTypes.find((item) => item.value === value);
			if (selected) {
				return selected.label;
			}
		}

		return 'Select Flight Type';
	});
</script>

{#if variant == 'combination'}
	<div>
		<Tabs.Root bind:value class="w-full">
			<Tabs.List class="grid h-11 w-full grid-cols-3">
				{#each flightTypes as type}
					<Tabs.Trigger
						class="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground py-2"
						value={type.value}>{type.label}</Tabs.Trigger
					>
				{/each}
			</Tabs.List>
		</Tabs.Root>
	</div>
{:else}
	<div>
		{#if type === 'select'}
			<Select.Root type="single" name="favoriteFruit" bind:value>
				<Select.Trigger
					class={cn(
						buttonVariants({
							variant: 'ghost',
							class: cn('text-primary hover:text-primary flex w-auto justify-start px-2')
						}),
						'border-none shadow-none focus:ring-0 focus:ring-offset-0',
						triggerClass
					)}
				>
					{triggerContent}
				</Select.Trigger>
				<Select.Content align="start">
					<Select.Group>
						{#each flightTypes as flightType (flightType.value)}
							<Select.Item value={flightType.value} label={flightType.label}
								>{flightType.label}</Select.Item
							>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		{:else}
			<Tabs.Root bind:value class={cn('w-[300px]', className)}>
				<Tabs.List class="grid w-full grid-cols-3">
					{#each flightTypes as type}
						<Tabs.Trigger value={type.value}>{type.label}</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</Tabs.Root>
		{/if}
	</div>
{/if}
