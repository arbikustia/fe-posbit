<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import * as Tooltip from '$lib/components/ui/tooltip/index.js';
	import { cn } from '$lib/utils';
	const { triggerClass, variant } = $props();
</script>

<Button
	variant={variant}
	class={cn('flex h-10 w-full items-center rounded-md border px-2 py-1 md:w-[25%]', triggerClass)}
>
	<span class="flex items-center text-sm font-semibold text-[#44403C]">
		<span>Indonesia Area Only </span>
		<Tooltip.Provider>
			<Tooltip.Root>
				<Tooltip.Trigger>
					<Button variant="link">
						<Icon icon="octicon:info-24" width="24" height="24" />
					</Button>
				</Tooltip.Trigger>
				<Tooltip.Content>
					<div class="font-sans text-sm">
						This travel insurance is only valid for domestic travel within Indonesia
					</div>
				</Tooltip.Content>
			</Tooltip.Root>
		</Tooltip.Provider>
	</span>
</Button>
