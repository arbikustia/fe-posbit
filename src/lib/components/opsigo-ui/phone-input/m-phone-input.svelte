<script lang="ts">
	import type { PhoneInputProps } from './types';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Command from '$lib/components/ui/command';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';
	import Badge from '../../ui/badge/badge.svelte';
	import clsx from 'clsx';
	import { OSGPrefixedInput } from '../prefixed-input';
	import { usePhoneInput } from './phone-input.svelte.js';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		...restProps
	}: PhoneInputProps = $props();

	const { state, countries, handlePhoneInput, getFlagImage, handleSelectCountry } = usePhoneInput();
</script>

<OSGPrefixedInput
	bind:ref
	bind:value={state.phoneNumber}
	oninput={(e) => handlePhoneInput(e, (val) => (value = val))}
	{...restProps}
>
	{#snippet inputPrefix()}
		<Drawer.Root bind:open={state.isCountrySelectOpen}>
			<Drawer.Trigger
				bind:ref={state.countrySelectTriggerRef}
				class="min-w-max focus-visible:ring-0"
				type="button"
			>
				<div class="flex w-fit items-center gap-x-2">
					<img src={getFlagImage(state.selectedCountry.iso)} alt="flag" width="20" />
					<p class="text-sm">{state.selectedCountry.code}</p>
					<ChevronDown class="h-4 w-4" />
				</div>
			</Drawer.Trigger>
			<Drawer.Content class="p-0">
				<Command.Root>
					<Command.Input placeholder="Search Country" />
					<Command.List class="custom-scrollbar">
						<Command.Empty>Country not found.</Command.Empty>
						<Command.Group>
							{#each countries as country}
								<Command.Item
									onSelect={() => {
										handleSelectCountry(country, (val) => (value = val));
									}}
									class={clsx('cursor-pointer', {
										'bg-primary/10': state.selectedCountry.iso === country.iso
									})}
									keywords={[country.name]}
									value={country.iso}
								>
									<div class="flex w-full items-center">
										<div class="flex w-full items-center gap-2">
											<img src={getFlagImage(country.iso)} alt="flag" width="20" />
											<div class="flex-1">
												{country.name}
											</div>
											<Badge
												variant="outline"
												class="block w-[50px] px-0 text-center text-sm text-gray-700"
												>{country.code}</Badge
											>
										</div>
									</div>
								</Command.Item>
							{/each}
						</Command.Group>
					</Command.List>
				</Command.Root>
			</Drawer.Content>
		</Drawer.Root>
	{/snippet}
</OSGPrefixedInput>
