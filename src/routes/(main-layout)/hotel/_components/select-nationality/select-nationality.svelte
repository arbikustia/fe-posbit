<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import { type CommandItemProps } from 'bits-ui';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	type SelectNationalityItemProps = {
		item: any;
		onSelect: (e: string) => void;
		state: any;
	} & CommandItemProps;

	let { item, onSelect, state, ...props }: SelectNationalityItemProps = $props();
</script>

<Command.Item value={item.countryName} class={cn('cursor-pointer')} {...props}>
	<Button
		variant="ghost"
		class="flex h-10 w-full items-center"
		onclick={() => {
			onSelect(item.countryName), (state.searchModel.nationalityIcon = item.icon);
		}}
	>
		<div class="flex w-full items-center gap-2">
			<Command.Item class="flex w-full items-center justify-between gap-1 py-2">
				<div class="flex items-center justify-center gap-2">
					<Icon icon={item.icon} width="26" height="26" />

					<span class="flex flex-col items-start">
						<span class="text-muted-foreground text-xs">{item.countryName}a</span>
					</span>
				</div>
			</Command.Item>
		</div>
	</Button>
</Command.Item>
