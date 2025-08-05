<script lang="ts">
	import { OSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { cn } from '$lib/utils';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Icon from '@iconify/svelte';
	import { GuestRoom } from '../guest-room';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { useSearchForm } from './search-hotel-panel.svelte.js';
	import dayjs from 'dayjs';
		import dummy from '$lib/dummy/hotel.json';
	import { SelectWrapper } from '../select-wrapper';
	import { SelectNameHotel } from '../../search/_components/select-name-hotel';
	import DatePicker from './date-picker-hotel.svelte';
	import DatePickerHotel from './date-picker-hotel.svelte';
	import { useSelectWrapper } from '../select-wrapper/use-seelct-wrapper.svelte';

	let { variant = 'default', onSubmitCallback, isLoading }: any = $props();
	const { state, getNights, submitSearch, increaseGuest, decreaseGuest } = useSearchForm();
</script>

{#if variant === 'sticky'}
	{#snippet searchButton()}
		<Button
			class={cn('h-9 w-[120px] flex-none text-lg', {})}
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
	<section class="bg-card z-31 sticky top-0 border-y shadow-sm">
		<div class="mx-auto max-w-6xl space-y-1 px-4 pb-2 pt-2">
			<OSGSelectCompany
				bind:value={state.searchModel.companyCode}
				triggerClass="h-fit! text-xs p-1!"
				showIcon={false}
				showSelectedCode={false}
			></OSGSelectCompany>
			<div class="flex w-full flex-row items-end justify-center gap-2">
				<div class="w-[30%] min-w-[30%]">
					<SelectWrapper
						options={dummy.data}
						title=""
						placeholder="Search Hotel"
						variant="sticky"
						bind:value={state.searchModel.destination}
					>
						{#snippet icon()}
							<Icon icon="lucide:hotel" width="24" height="24" />
						{/snippet}
						{#snippet outlet({ item, onSelect }: any)}
							<SelectNameHotel {item} {onSelect} />
						{/snippet}
					</SelectWrapper>
				</div>
				<DatePickerHotel {variant} bind:dateRange={state.searchModel.date} isEndDate={true} />
				<GuestRoom variant="sticky" {state} {increaseGuest} {decreaseGuest} />
				{@render searchButton()}
			</div>
		</div>
	</section>
{:else if variant === 'default'}
	{#snippet icon()}
		<Icon icon="lucide:hotel" width="24" height="24" />
	{/snippet}
	{#snippet outlet({ item, onSelect }: any)}
		<SelectNameHotel {item} {onSelect} />
	{/snippet}
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
	<section class="w-full space-y-1">
		<Card.Root>
			<Card.Content class="flex w-full flex-col items-start gap-3 ">
				<OSGSelectCompany bind:value={state.searchModel.companyCode}></OSGSelectCompany>
				<div class="flex w-full flex-row items-end justify-center gap-5">
					<div class="w-[30%] min-w-[30%]">
						<SelectWrapper
							options={dummy.data}
							variant="default"
							title="City, Country, or Hotel Name"
							placeholder="Search Hotel"
							bind:value={state.searchModel.destination}
						>
							{#snippet icon()}
								<Icon icon="lucide:hotel" width="24" height="24" />
							{/snippet}
							{#snippet outlet({ item, onSelect }: any)}
								<SelectNameHotel {item} {onSelect} />
							{/snippet}
						</SelectWrapper>
					</div>
					<DatePickerHotel {variant} bind:dateRange={state.searchModel.date} />
					<GuestRoom variant="default" {state} {increaseGuest} {decreaseGuest} />
					{@render searchButton()}
				</div>
			</Card.Content>
		</Card.Root>
	</section>
{:else if variant === 'carousel' || variant === 'combination'}
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
	<section class="w-full space-y-2">
		<Card.Root class="w-full">
			<Card.Content class="flex w-full flex-col items-start gap-2 ">
				<OSGSelectCompany bind:value={state.searchModel.companyCode}></OSGSelectCompany>
				<div class="flex w-full flex-col items-end justify-center gap-2">
					<div class="w-full min-w-[30%]">
						<SelectWrapper
							options={dummy.data}
							variant="combination"
							title=""
							placeholder="Search Hotel"
							bind:value={state.searchModel.destination}
						>
							{#snippet icon()}
								<Icon icon="lucide:hotel" class="text-primary" width="24" height="24" />
							{/snippet}
							{#snippet outlet({ item, onSelect }: any)}
								<SelectNameHotel {item} {onSelect} />
							{/snippet}
						</SelectWrapper>
					</div>
					<DatePickerHotel {variant} bind:dateRange={state.searchModel.date} />
					<GuestRoom variant="combination" {state} {increaseGuest} {decreaseGuest} />
					{@render searchButton()}
				</div>
			</Card.Content>
		</Card.Root>
	</section>
{/if}
