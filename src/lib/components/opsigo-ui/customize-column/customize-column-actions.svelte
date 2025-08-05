<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import type { defaultColumn } from './type';

	let {
		selectedType = $bindable(),
		customDialog = $bindable(false),
		selectedKeys = $bindable(),
		keysActiveColumn = $bindable(),
		presetTable = []
	}: {
		selectedType: string;
		customDialog: boolean;
		selectedKeys: string[];
		keysActiveColumn: string[];
		presetTable: defaultColumn[];
	} = $props();

	let type = $state('');

	$effect(() => {
		if (selectedType) {
			type = selectedType;
			selectedType = '';
		}
		if (type === 'customize') {
			customDialog = true;
			type = '';
		} else {
			const find = presetTable.find((e) => e.presetName === type);
			selectedKeys = find?.keysColumn || [];
		}
	});

	const onEditColumn = (keys: string[]) => {
		customDialog = true;
		keysActiveColumn = selectedKeys.length ? selectedKeys : keys;
	};
</script>

{#if !presetTable.length}
	<Button
		variant="outline"
		onclick={() => (customDialog = true)}
		class="border-primary text-primary"
	>
		<Icon icon="icon-park-outline:column" />
		Customize Column
	</Button>
{:else}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={cn(buttonVariants({ variant: 'outline' }), 'border-primary text-primary')}
		>
			<Icon icon="icon-park-outline:column" />
			{type || 'Select Preset'}
			<Icon icon="mingcute:down-fill" />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="min-w-48">
			<DropdownMenu.RadioGroup bind:value={type}>
				{#each presetTable as item}
					<DropdownMenu.RadioItem value={item.presetName} class="flex items-center gap-2 pr-2">
						<span class="w-full">{item.presetName}</span>
						<button onclick={() => onEditColumn(item.keysColumn)}>
							<Icon icon="lucide:edit" />
						</button>
						<button><Icon icon="tabler:trash" class="text-red-500" /></button>
					</DropdownMenu.RadioItem>
				{/each}
				<DropdownMenu.RadioItem value="customize" class="w-full">
					Customize Table
				</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
