<script lang="ts">
	import * as Command from '$lib/components/ui/command';
	import * as Drawer from '$lib/components/ui/drawer';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Check from '@lucide/svelte/icons/check';
	import X from '@lucide/svelte/icons/x';
	import { useLanguageSwitch } from './language-switch.svelte.js';

	const { currentLang, switchLanguage } = useLanguageSwitch();
	let open = false;
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger class="w-full">
		<div
			class={cn(
				'flex items-center justify-between gap-2 font-semibold text-(--sidebar-foreground)/80 px-2'
				
			)}
		>
			<span>Language</span>
			<Icon icon="weui:arrow-outlined" width="12" height="24" class="text-(--sidebar-foreground)/80" />
		</div>
	</Drawer.Trigger>

	<Drawer.Portal>
		<Drawer.Content class="z-50   bg-white">
			<div class="flex-1 overflow-y-auto p-4">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-xl font-bold">Change Language</h2>
					<Drawer.Close class="rounded-full p-1 hover:bg-gray-100">
						<X class="h-6 w-6" />
					</Drawer.Close>
				</div>

				<Command.Root class="h-fit">
					<Command.List>
						<Command.Group>
							<Command.Separator class="my-2" />
							<Command.Item
								onSelect={() => {
									switchLanguage('en');
									open = false;
								}}
								class="p-3 aria-selected:bg-transparent"
							>
								<div class="flex w-full items-center justify-between">
									<div class="flex items-center gap-3">
										<Icon icon="twemoji:flag-united-states" width="26" height="26" />
										English
									</div>
									<Check class={cn('size-5', currentLang != 'en' && 'text-transparent')} />
								</div>
							</Command.Item>
							<Command.Item
								onSelect={() => {
									switchLanguage('id');
									open = false;
								}}
								class="p-3 aria-selected:bg-transparent"
							>
								<div class="flex w-full items-center justify-between">
									<div class="flex items-center gap-3">
										<Icon icon="twemoji:flag-indonesia" width="26" height="26" />
										Bahasa Indonesia
									</div>
									<Check class={cn('size-5', currentLang != 'id' && 'text-transparent')} />
								</div>
							</Command.Item>
						</Command.Group>
					</Command.List>
				</Command.Root>
			</div>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root>
