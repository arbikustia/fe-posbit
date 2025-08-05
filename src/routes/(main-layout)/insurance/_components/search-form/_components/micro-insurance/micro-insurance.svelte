<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Icon from '@iconify/svelte';
	import { OSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import { StartDate } from './_components/start-date';
	import { EndDate } from './_components/end-date';
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import dayjs from 'dayjs';

	let { state, variant, submitSearch, travelOption, onSubmitCallback, isLoading }: any = $props();
	const countDays = $derived.by(() => {
		if (state.searchModel.coverageStartDate && state.searchModel.coverageEndDate) {
			const start = new Date(state.searchModel.coverageStartDate);
			const end = new Date(state.searchModel.coverageEndDate);
			const diffInMs: any = Number(end) - Number(start);
			const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
			return `${diffInDays + 1}`;
		}
	});
	// function addDays(date: Date, days: number): Date {
	// 	const result = new Date(date);
	// 	result.setDate(result.getDate() + days);
	// 	return result;
	// }

	// function setEndDate(days: number) {
	// 	if (state.searchModel.coverageStartDate) {
	// 		const startDate = new Date(state.searchModel.coverageStartDate);
	// 		const endDate = addDays(startDate, days - 1); // -1 untuk inklusif
	// 		dateRange = { ...dateRange, end: endDate };
	// 		isEndDate = true;
	// 	}
	// 	state.searchModel.coverageEndDate = dayjs(state.searchModel.coverageStartDate)
	// 		.add(days - 1, 'day')
	// 		.format('YYYY-MM-DD');
	// }
</script>

{#if variant === 'sticky'}
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
	<section class="flex w-full flex-col items-center space-y-1">
		<div class="flex w-full justify-between">
			<div class="flex items-center">
				{@render travelOption?.()}
				<OSGSelectCompany
					showIcon={false}
					triggerClass="h-fit! text-xs p-1!"
					bind:value={state.searchModel.companyCode}
				></OSGSelectCompany>
			</div>
		</div>
		<Tabs.Root bind:value={state.searchModel.coverageperiod} class="w-full ">
			<div class="flex w-full items-end gap-4">
				<div class="flex flex-col gap-1">
					<Tabs.List>
						<Tabs.Trigger value="6-months">6 Months</Tabs.Trigger>
						<Tabs.Trigger value="annual">Annual</Tabs.Trigger>
					</Tabs.List>
				</div>
				<Tabs.Content value="6-months">
					<div class="flex w-full items-end justify-between gap-4">
						<div class="flex w-full gap-4">
							<div class="flex w-[30%] flex-col gap-1">
								<Button variant="secondary" class={cn('w-full')}>
									<OSGDatePicker bind:value={state.searchModel.coverageStartDate} />
								</Button>
							</div>

							<div class="flex w-[30%] flex-col gap-1">
								<Button variant="secondary" class={cn('w-full')}>
									<OSGDatePicker
										bind:value={state.searchModel.coverageEndDate}
										positionCalendar="end"
										minValue={state.searchModel.coverageStartDate}
										otherDate={state.searchModel.coverageStartDate}
										disabled={true}
									/>
								</Button>
							</div>
						</div>

						{@render searchButton()}
					</div>
				</Tabs.Content>
				<Tabs.Content value="annual">
					<div class="flex w-full items-end justify-between gap-4">
						<div class="flex w-full gap-4">
							<div class="flex w-[30%] flex-col gap-1">
								<Button variant="secondary" class={cn('w-full')}>
									<OSGDatePicker bind:value={state.searchModel.coverageStartDate} />
								</Button>
							</div>
							<div class="flex w-[30%] flex-col gap-1">
								<Button variant="secondary" class={cn('w-full')}>
									<OSGDatePicker
										bind:value={state.searchModel.coverageEndDate}
										positionCalendar="end"
										minValue={state.searchModel.coverageStartDate}
										otherDate={state.searchModel.coverageStartDate}
										disabled={true}
									/>
								</Button>
							</div>
						</div>
						{@render searchButton()}
					</div>
				</Tabs.Content>
			</div>
		</Tabs.Root>
	</section>
{:else if variant == 'default'}
	{#snippet searchButton()}
		<Button
			class={cn('h-12 w-[120px] flex-none text-lg', {})}
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
					</div>
				</div>
				<Tabs.Root bind:value={state.searchModel.coverageperiod} class="w-full ">
					<div class="flex w-full items-end gap-4">
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium text-gray-600">Coverage Period</span>
							<Tabs.List class="h-12">
								<Tabs.Trigger value="6-months">6 Months</Tabs.Trigger>
								<Tabs.Trigger value="annual">Annual</Tabs.Trigger>
							</Tabs.List>
						</div>
						<Tabs.Content value="6-months">
							<div class="flex h-12 w-full items-end justify-between gap-4">
								<div class="flex w-full gap-4">
									<div class="flex w-[30%] flex-col gap-1">
										{#if variant == 'default'}
											<span class="text-sm font-medium text-gray-600">Coverage Start Date</span>
										{/if}
										<Button variant="secondary" class={cn('h-12 w-full')}>
											<OSGDatePicker bind:value={state.searchModel.coverageStartDate} />
										</Button>
									</div>
									<div class="flex w-[30%] flex-col gap-1">
										{#if variant == 'default'}
											<span class="text-sm font-medium text-gray-600">Coverage End Date</span>
										{/if}
										<Button variant="secondary" class={cn('h-12 w-full')}>
											<OSGDatePicker
												bind:value={state.searchModel.coverageEndDate}
												positionCalendar="end"
												minValue={state.searchModel.coverageStartDate}
												otherDate={state.searchModel.coverageStartDate}
												disabled={true}
											/>
										</Button>
									</div>
								</div>

								{@render searchButton()}
							</div>
						</Tabs.Content>
						<Tabs.Content value="annual">
							<div class="flex w-full items-end justify-between gap-4">
								<div class="flex w-full gap-4">
									<div class="flex w-[30%] flex-col gap-1">
										{#if variant == 'default'}
											<span class="text-sm font-medium text-gray-600">Coverage Start Date</span>
										{/if}
										<Button variant="secondary" class={cn('h-12 w-full')}>
											<OSGDatePicker bind:value={state.searchModel.coverageStartDate} />
										</Button>
									</div>
									<div class="flex w-[30%] flex-col gap-1">
										{#if variant == 'default'}
											<span class="text-sm font-medium text-gray-600">Coverage End Date</span>
										{/if}
										<Button variant="secondary" class={cn('h-12 w-full')}>
											<OSGDatePicker
												bind:value={state.searchModel.coverageEndDate}
												positionCalendar="end"
												minValue={state.searchModel.coverageStartDate}
												otherDate={state.searchModel.coverageStartDate}
												disabled={true}
											/>
										</Button>
									</div>
								</div>

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
			class={cn('h-12 w-full flex-none text-lg', {})}
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
					</div>
				</div>
				<Tabs.Root bind:value={state.searchModel.coverageperiod} class="w-full ">
					<div class="flex w-full flex-col items-start gap-4">
						<div class="flex flex-col gap-1">
							<span class="text-sm font-medium text-gray-600">Coverage Period</span>
							<Tabs.List class="h-8 rounded-full">
								<Tabs.Trigger
									class="data-[state=active]:text-primary rounded-full font-bold"
									value="6-months"
								>
									6 Months
								</Tabs.Trigger>
								<Tabs.Trigger
									class="data-[state=active]:text-primary rounded-full font-bold"
									value="annual"
								>
									Annual
								</Tabs.Trigger>
							</Tabs.List>
						</div>
						<Tabs.Content value="6-months" class="w-full">
							<div class="flex w-full flex-col items-end justify-between gap-4">
								<div class="relative w-full rounded-md border">
									<div class="py-1">
										<p class="px-2 text-xs text-gray-500">Coverage Start Date</p>
										<OSGDatePicker bind:value={state.searchModel.coverageStartDate} />
									</div>

									<div class="px-2">
										<Separator />
										<p class="absolute right-5 top-12 bg-white px-2 text-sm text-gray-500">
											{countDays} days
										</p>
									</div>
									<div class="py-1">
										<p class="px-2 text-xs text-gray-500">Coverage End Date</p>
										<OSGDatePicker
											bind:value={state.searchModel.coverageEndDate}
											positionCalendar="end"
											minValue={state.searchModel.coverageStartDate}
											otherDate={state.searchModel.coverageStartDate}
											disabled={true}
										/>
									</div>
								</div>
							</div>
						</Tabs.Content>
						<Tabs.Content value="annual" class="w-full">
							<div class="flex w-full flex-col items-end justify-between gap-4">
								<div class="relative w-full rounded-md border">
									<div class="py-1">
										<p class="px-2 text-xs text-gray-500">Coverage Start Date</p>
										<OSGDatePicker bind:value={state.searchModel.coverageStartDate} />
									</div>

									<div class="px-2">
										<Separator />
										<p class="absolute right-5 top-12 bg-white px-2 text-sm text-gray-500">
											{countDays} days
										</p>
									</div>
									<div class="py-1">
										<p class="px-2 text-xs text-gray-500">Coverage End Date</p>
										<OSGDatePicker
											bind:value={state.searchModel.coverageEndDate}
											positionCalendar="end"
											minValue={state.searchModel.coverageStartDate}
											otherDate={state.searchModel.coverageStartDate}
											disabled={true}
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
