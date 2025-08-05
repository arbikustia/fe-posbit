<script>
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Command from '$lib/components/ui/command';
	import { nationalities } from './constants';
	import { Check, ChevronDown } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let { value = $bindable(), ...props } = $props();

	let open = $state(false);

	const selectedNationalityLabel = $derived.by(() => {
		if (value) {
			return nationalities.find((n) => n.value === value)?.label;
		}

		return 'Nationality';
	});
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger type="button" class="w-full">
		<div
			class={cn(
				'h-9 w-full rounded-md border border-input bg-white shadow-xs transition-colors focus-within:ring-1 focus-within:ring-ring',
				//data error
				'data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive'
			)}
			data-fs-error={props['data-fs-error']}
		>
			<div class="flex h-full items-center justify-between px-3 text-sm">
				<p class={cn({ 'text-muted-foreground': value === '' })}>
					{selectedNationalityLabel}
				</p>

				<ChevronDown class="h-4 w-4 text-muted-foreground opacity-50" />
			</div>
		</div>
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>Nationality</Drawer.Title>
		</Drawer.Header>
		<Command.Root shouldFilter={false} class="h-full">
			<Command.List class="max-h-full">
				<Command.Group>
					{#each nationalities as nationality}
						<Command.Item
							value={nationality.value}
							onSelect={() => {
								value = nationality.value;
								open = false;
							}}
							class={cn('flex items-center justify-between aria-selected:bg-transparent', {
								'bg-accent!': value === nationality.value
							})}
						>
							<div class="flex w-full items-center justify-between">
								{nationality.label}
								<Check
									class={cn('mr-2 size-4', value !== nationality.value && 'text-transparent')}
								/>
							</div>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Drawer.Content>
</Drawer.Root>
