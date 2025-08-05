<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Icon from '@iconify/svelte';
	import { OSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import { SelectTripInsurance } from './_components/select-trip';
	import { SelectGroupType } from './_components/select-group-type';
	import { SelectPaxInsurance } from './_components/select-pax';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { International } from './_components/international';
	import { Domestic } from './_components/domestic';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	let { state, variant, submitSearch, travelOption, onSubmitCallback, isLoading }: any = $props();
</script>

{#if variant === 'sticky'}
	{#snippet searchButton()}
		<Button
			class={cn('h-10 w-[120px] flex-none text-lg', {})}
			size="lg"
			disabled={state.isSubmitted || isLoading}
			onclick={() => submitSearch(onSubmitCallback)}
		>
			{#if state.isSubmitted || isLoading}
				<LoaderCircle class="animate-spin" />
			{:else}
				<Icon icon="bx:search-alt" width="24" height="24" /> <span class="ml-1">Search</span>
			{/if}
		</Button>
	{/snippet}
	<div class="flex w-full flex-col items-center space-y-1">
		<div class="flex w-full justify-between">
			<div class="flex items-center gap-2">
				{@render travelOption?.()}
				<OSGSelectCompany
					bind:value={state.searchModel.companyCode}
					triggerClass="h-fit! text-xs p-1!"
					showIcon={false}
					showSelectedCode={false}
				></OSGSelectCompany>
				<SelectTripInsurance
					triggerClass="h-fit! text-xs p-1!"
					showIcon={false}
					bind:value={state.searchModel.tripMode}
				/>
			</div>
			<div class="flex items-center">
				<SelectGroupType
					triggerClass="h-fit! text-xs p-1!"
					showIcon={false}
					{variant}
					bind:value={state.searchModel.groupType}
				/>
				<SelectPaxInsurance
					bind:adult={state.searchModel.adult}
					bind:child={state.searchModel.child}
					triggerClass="h-fit! text-xs p-1!"
					showIcon={false}
				/>
			</div>
		</div>
		<Tabs.Root bind:value={state.searchModel.coverageArea} class="w-full ">
			<div class="flex w-full items-end gap-4">
				<div class="flex flex-col gap-1">
					{#if variant == 'default'}
						<span class="text-sm font-medium text-gray-600">Select Coverage Area</span>
					{/if}
					<Tabs.List class="h-10">
						<Tabs.Trigger value="international">International</Tabs.Trigger>
						<Tabs.Trigger value="domestic">Domestic</Tabs.Trigger>
					</Tabs.List>
				</div>
				<Tabs.Content value="international">
					<div class="flex h-10 w-full items-end justify-between gap-4">
						<International isEndDate={true} {state} triggerClass="h-10" {variant} />
						{@render searchButton()}
					</div>
				</Tabs.Content>
				<Tabs.Content value="domestic">
					<div class="flex w-full items-end justify-between gap-4">
						<Domestic triggerClass="h-10" {variant} {state} />
						{@render searchButton()}
					</div>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</div>
{:else if variant == 'default'}
	{#snippet searchButton()}
		<Button
			class={cn('h-11 w-[120px] flex-none text-lg', {})}
			size="lg"
			disabled={state.isSubmitted || isLoading}
			onclick={() => submitSearch(onSubmitCallback)}
		>
			{#if state.isSubmitted || isLoading}
				<LoaderCircle class="animate-spin" />
			{:else}
				<Icon icon="bx:search-alt" width="24" height="24" /> <span class="ml-1">Search</span>
			{/if}
		</Button>
	{/snippet}
	<Card.Root>
		<Card.Content>
			<section class="flex w-full flex-col items-center space-y-5">
				<div class="flex w-full justify-between">
					<div class="flex items-center">
						<OSGSelectCompany bind:value={state.searchModel.companyCode}></OSGSelectCompany>
						<SelectTripInsurance showIcon={true} bind:value={state.searchModel.tripMode} />
					</div>
					<div class="flex items-center">
						<SelectGroupType showIcon={true} bind:value={state.searchModel.groupType} />
						<SelectPaxInsurance
							bind:adult={state.searchModel.adult}
							bind:child={state.searchModel.child}
							showIcon={true}
						/>
					</div>
				</div>
				<Tabs.Root bind:value={state.searchModel.coverageArea} class="w-full ">
					<div class="flex w-full items-end gap-4">
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium text-gray-600">Select Coverage Area</span>
							<Tabs.List class="h-[45.33px]">
								<Tabs.Trigger value="international">International</Tabs.Trigger>
								<Tabs.Trigger value="domestic">Domestic</Tabs.Trigger>
							</Tabs.List>
						</div>
						<Tabs.Content value="international">
							<div class="flex w-full items-end justify-between gap-4">
								<International isEndDate={false} {state} triggerClass {variant} />
								{@render searchButton()}
							</div>
						</Tabs.Content>
						<Tabs.Content value="domestic">
							<div class="flex w-full items-end justify-between gap-4">
								<Domestic triggerClass="h-11" {variant} {state} />
								{@render searchButton()}
							</div>
						</Tabs.Content>
					</div>
				</Tabs.Root>
			</section>
		</Card.Content>
	</Card.Root>
{:else if variant == 'combination'}
	{#snippet searchButton()}
		<Button
			class={cn('h-11 w-full flex-none text-lg', {})}
			size="lg"
			disabled={state.isSubmitted || isLoading}
			onclick={() => submitSearch(onSubmitCallback)}
		>
			{#if state.isSubmitted || isLoading}
				<LoaderCircle class="animate-spin" />
			{:else}
				<Icon icon="bx:search-alt" width="24" height="24" /> <span class="ml-1">Search</span>
			{/if}
		</Button>
	{/snippet}
	<Card.Root>
		<Card.Content>
			<section class="flex w-full flex-col items-center space-y-5">
				<div class="flex w-full flex-col justify-between gap-2">
					<div class="grid w-full grid-cols-2 items-center">
						<OSGSelectCompany bind:value={state.searchModel.companyCode}></OSGSelectCompany>
						<SelectTripInsurance showIcon={true} bind:value={state.searchModel.tripMode} />
					</div>
				</div>
				<Tabs.Root bind:value={state.searchModel.coverageArea} class="w-full ">
					<div class="flex w-full flex-col items-start gap-4">
						<div class="flex w-full flex-col gap-1">
							<Tabs.List class="h-8 rounded-full">
								<Tabs.Trigger
									class="data-[state=active]:text-primary rounded-full font-bold"
									value="international"
								>
									International
								</Tabs.Trigger>
								<Tabs.Trigger
									class="data-[state=active]:text-primary rounded-full font-bold"
									value="domestic"
								>
									Domestic
								</Tabs.Trigger>
							</Tabs.List>
						</div>
						<Tabs.Content value="international" class="w-full">
							<div class="flex w-full flex-col items-end justify-between gap-4">
								<International isEndDate={false} {state} triggerClass {variant} />
								<div class="w-full rounded border py-1">
									<div class="flex w-full flex-col gap-2">
										<label class="px-2 text-xs text-gray-500" for="type">Type</label>
										<SelectGroupType
											showIcon={true}
											triggerClass="w-full px-2"
											{variant}
											bind:value={state.searchModel.groupType}
										/>
									</div>
									<Separator class="my-1 flex-1" />
									<div class="flex w-full flex-col gap-2">
										<label class="px-2 text-xs text-gray-500" for="traveler">Traveler</label>
										<SelectPaxInsurance
											{variant}
											triggerClass="w-full px-2"
											bind:adult={state.searchModel.adult}
											bind:child={state.searchModel.child}
											showIcon={true}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="domestic" class="w-full">
							<div class="flex w-full flex-col items-end justify-between gap-4">
								<Domestic triggerClass="h-11" {variant} {state} />
								<div class="w-full rounded border py-1">
									<div class="flex w-full flex-col gap-2">
										<label class="px-2 text-xs text-gray-500" for="type">Type</label>
										<SelectGroupType
											showIcon={true}
											triggerClass="w-full px-2"
											{variant}
											bind:value={state.searchModel.groupType}
										/>
									</div>
									<Separator class="my-1 flex-1" />
									<div class="flex w-full flex-col gap-2">
										<label class="px-2 text-xs text-gray-500" for="traveler">Traveler</label>
										<SelectPaxInsurance
											{variant}
											triggerClass="w-full px-2"
											bind:adult={state.searchModel.adult}
											bind:child={state.searchModel.child}
											showIcon={true}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
					</div>
				</Tabs.Root>
			</section>
		</Card.Content>
	</Card.Root>
	<div class="px-5 py-5">
		{@render searchButton()}
	</div>
{/if}
