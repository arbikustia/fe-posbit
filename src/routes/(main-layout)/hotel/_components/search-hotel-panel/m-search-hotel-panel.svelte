<script lang="ts">
	import { MOSGSelectCompany } from '$lib/components/opsigo-ui/select-company';
	import * as Card from '$lib/components/ui/card';
	import { slide } from 'svelte/transition';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import LoaderCircle from '@lucide/svelte/icons/loader-circle';
	import Icon from '@iconify/svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import type { Route } from '$lib/types/SearchFlightParam';
	import { useSearchForm } from './search-hotel-panel.svelte.js';
	import MSearchFormValidationAlert from '../../../flight/_components/search-form/m-search-form-validation-alert.svelte';
	import { SelectLocationHotel } from '../select-location/index.js';
	import { DrawerWrapper } from '../drawer-wrapper/index.js';
	import { SelectNameHotel } from '../../search/_components/select-name-hotel/index.js';
	import dayjs from 'dayjs';
	import { cn } from '$lib/utils.js';
	import RangeCalendar from '$lib/components/ui/range-calendar/range-calendar.svelte';
	import { MGuestRoom } from '../guest-room/index.js';
	import MDatePickerHotel from './m-date-picker-hotel.svelte';

	let { isLoading, onSubmitCallback }: any = $props();

	const { state, getNights, submitSearch } = useSearchForm();
	const dataGuest = (guest: number, room: number) => {
		console.log(guest, room);
	};
</script>

{#snippet submitButton()}
	<Button
		class="mt-5! w-full flex-none text-lg"
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

<div class="w-full space-y-2">
	<MSearchFormValidationAlert
		show={state.validation.isInvalidCompany}
		title="Please select a company"
	/>
	<MOSGSelectCompany triggerClass="text-primary pl-4" bind:value={state.searchModel.companyCode} />
	<DrawerWrapper
		title=""
		placeholder="City, Country or Hotel Name"
		bind:value={state.searchModel.destination}
	>
		{#snippet icon()}
			<Icon icon="lucide:hotel" width="24" height="24" />
		{/snippet}
		{#snippet outlet({ locationName, countryName, type, onSelect }: any)}
			<SelectNameHotel {locationName} {countryName} {type} {onSelect} />
		{/snippet}
	</DrawerWrapper>
	<!-- <Drawer.Root bind:open={state.searchModel.popoverOpen}>
		<Drawer.Trigger
			class={cn(buttonVariants({ variant: 'secondary' }), 'flex items-center justify-start w-full')}
		>
			<Icon icon="solar:calendar-line-duotone" width="24" height="24" />
			{#if state.searchModel.date?.start && state.searchModel.date?.end}
				{dayjs(state.searchModel.date.start).format('MMM D, YYYY')} - {dayjs(
					state.searchModel.date.end
				).format('MMM D, YYYY')}
			{:else}
				Pick a date
			{/if}
		</Drawer.Trigger>
		<Drawer.Content>
			<div class="w-full">
				<Drawer.Header class="flex flex-col items-start justify-start">
					<Drawer.Title>Select Date Range</Drawer.Title>
					<Drawer.Description>Choose your start and end dates</Drawer.Description>
				</Drawer.Header>

				<RangeCalendar
					class="w-full"
					bind:value={state.searchModel.date}
					onStartValueChange={(v) => {
						state.searchModel.startValue = v;
					}}
					onValueChange={(v) => {
						if (v?.end) {
							state.searchModel.date = v;
							state.searchModel.popoverOpen = false;
						}
					}}
					numberOfMonths={1}
				/>
			</div>
		</Drawer.Content>
	</Drawer.Root> -->
	<MDatePickerHotel bind:dateRange={state.searchModel.date} />
	<MGuestRoom {dataGuest} />
	<!-- SEARCH BUTTON -->
	{@render submitButton()}
</div>
