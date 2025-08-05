<script>
	import CardInfo from './card-info.svelte';
	import { CoverageDate } from '../international/_components/coverage-date';
	import DomesticEndDate from './domestic-end-date.svelte';
	import DomesticStartDate from './domestic-start-date.svelte';
	import { OSGDatePicker } from '$lib/components/opsigo-ui/date-picker';
	import Button from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
	import Separator from '$lib/components/ui/separator/separator.svelte';

	const { state, variant, triggerClass } = $props();
</script>

{#if variant == 'combination'}
	<div class="flex w-full flex-col items-start gap-4">
		<CardInfo variant="ghost" triggerClass="md:w-full px-6  items-center justify-center h-11" />
		<div class="relative w-full rounded-md border">
			<div class="py-1">
				<p class="px-2 text-xs text-gray-500">Start Date</p>
				<OSGDatePicker
					class="h-8  py-0"
					iconClass="text-primary"
					otherDate={state.searchModel.domesticEndDatev}
					bind:value={state.searchModel.domesticStartDate}
				/>
			</div>

			<div class="px-2">
				<Separator />
				<!-- <p class="absolute right-5 top-12 bg-white px-2 text-sm text-gray-500">{countDays} days</p> -->
			</div>
			<div class="py-1">
				<p class="px-2 text-xs text-gray-500">End Date</p>
				<OSGDatePicker
					bind:value={state.searchModel.domesticEndDate}
					positionCalendar="end"
					minValue={state.searchModel.domesticStartDate}
					otherDate={state.searchModel.domesticStartDate}
					class="h-8  py-0"
					iconClass="text-primary"
				/>
			</div>
		</div>
	</div>
{:else}
	<div class="flex w-[90%] flex-row items-end gap-4">
		<CardInfo variant="ghost" {triggerClass} />
		<div class="flex w-[30%] flex-col gap-1">
			{#if variant == 'default'}
				<span class="text-sm font-medium text-gray-600">Start Date</span>
			{/if}
			<Button variant="secondary" class={cn('w-full', triggerClass)}>
				<OSGDatePicker bind:value={state.searchModel.domesticStartDate} />
			</Button>
		</div>
		<div class="flex w-[30%] flex-col gap-1">
			{#if variant == 'default'}
				<span class="text-sm font-medium text-gray-600">End Date</span>
			{/if}
			<Button variant="secondary" class={cn('w-full', triggerClass)}>
				<OSGDatePicker
					bind:value={state.searchModel.domesticEndDate}
					positionCalendar="end"
					minValue={state.searchModel.domesticStartDate}
					otherDate={state.searchModel.domesticStartDate}
				/>
			</Button>
		</div>
	</div>
{/if}
