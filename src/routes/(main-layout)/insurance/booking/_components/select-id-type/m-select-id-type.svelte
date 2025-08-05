<script>
	import * as Command from '$lib/components/ui/command';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils';
	import { Check, ChevronDown } from '@lucide/svelte';
	import { types } from './constants';

	let { value = $bindable(), ...props } = $props();

	let open = $state(false);

	const label = $derived.by(() => {
		if (value) {
			return types.find((n) => n.value === value)?.label;
		}

		return 'ID Type';
	});
</script>

<button
	type="button"
	class={cn(
		'h-9 w-full rounded-md border border-input bg-white shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring',
		//data error
		'data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive'
	)}
	data-fs-error={props['data-fs-error']}
	onclick={() => (open = true)}
>
	<div class="flex h-full items-center justify-between px-3 text-sm">
		<p class={cn({ 'text-muted-foreground': value === '' })}>
			{label}
		</p>

		<ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
	</div>
</button>

<Drawer.Root bind:open>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>ID Type</Drawer.Title>
		</Drawer.Header>
		<Command.Root shouldFilter={false} class="h-full">
			<Command.List class="max-h-full">
				<Command.Group>
					{#each types as type}
						<Command.Item
							value={type.value}
							onSelect={() => {
								value = type.value;
								open = false;
							}}
							class={cn('flex items-center justify-between aria-selected:bg-transparent', {
								'bg-accent!': value === type.value
							})}
						>
							<div class="flex w-full items-center justify-between">
								{type.label}
								<Check class={cn('mr-2 size-4', value !== type.value && 'text-transparent')} />
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
