<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import { type CommandItemProps } from 'bits-ui';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Button from '$lib/components/ui/button/button.svelte';

	type SelectAirportItemProps = {
		item:any;
		onSelect: (e:string) => void;
	} & CommandItemProps;

	let { item, onSelect ,...props }: SelectAirportItemProps = $props();
</script>

<Command.Item value={item.locationName} class={cn('cursor-pointer')} {...props}>
	<Button variant="ghost" class="flex h-10 w-full items-center" onclick={() => onSelect(item.locationName)}>
		<div class="flex w-full items-center gap-2">
			<Command.Item
				class="flex w-full items-center justify-between gap-1 py-2"
			>
				<div class="flex items-center justify-center gap-2">
					<Icon icon="lucide:hotel" width="26" height="26" />

					<span class="flex flex-col items-start">
						<span class="text-sm text-black">{item.locationName}</span>
						<span class="text-xs text-muted-foreground">{item.countryName}</span>
					</span>
				</div>
				<Badge variant="outline" class="block w-[19%] text-center text-sm px-1">{item.type}</Badge>
			</Command.Item>
		</div>
	</Button>
</Command.Item>
