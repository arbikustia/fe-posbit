<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import Check from '@lucide/svelte/icons/check';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import { languageLabel } from './constants';
	import { useLanguageSwitch } from './language-switch.svelte.js';
	import type { Snippet } from 'svelte';
	import type { DropdownMenuContentProps } from 'bits-ui';

	type LanguageSwitchProps = {
		trigger?: Snippet;
		contentSide?: DropdownMenuContentProps['side'];
	};

	let { trigger, contentSide }: LanguageSwitchProps = $props();

	const { currentLang, switchLanguage } = useLanguageSwitch();
</script>

<DropdownMenu.Root>
	{#if trigger}
		{@render trigger()}
	{:else}
		<DropdownMenu.Trigger
			class={buttonVariants({
				variant: 'outline',
				className: 'flex items-center  text-gray-500'
			})}
		>
			<span class="font-normal">Language:</span>

			{languageLabel[currentLang]}
			<ChevronDown />
		</DropdownMenu.Trigger>
	{/if}

	<DropdownMenu.Content class="w-56" align="start" side={contentSide}>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Change Language</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onSelect={() => switchLanguage('en')}>
				<div class="flex w-full items-center justify-between">
					<div class="flex items-center gap-3">
						<Icon icon="twemoji:flag-united-states" width="26" height="26" /> English
					</div>
					<Check class={cn('size-5', currentLang != 'en' && 'text-transparent')} />
				</div>
			</DropdownMenu.Item>
			<DropdownMenu.Item onSelect={() => switchLanguage('id')}>
				<div class="flex w-full items-center justify-between">
					<div class="flex items-center gap-3">
						<Icon icon="twemoji:flag-indonesia" width="26" height="26" /> Bahasa Indonesia
					</div>
					<Check class={cn('size-5', currentLang != 'id' && 'text-transparent')} />
				</div>
			</DropdownMenu.Item>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
