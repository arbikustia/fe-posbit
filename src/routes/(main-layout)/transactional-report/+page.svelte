<script lang="ts">
	import { SelectField, TextField } from '$lib/components/opsigo-ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs';
	import { Info } from '@lucide/svelte';
	import { zod } from 'sveltekit-superforms/adapters';
	import { defaults, superForm } from 'sveltekit-superforms/client';
	import * as Alert from '$lib/components/ui/alert';
	import Icon from '@iconify/svelte';
	import { OSGPresetDatePicker } from '$lib/components/opsigo-ui/preset-date-picker';
	import { flightField, hotelField, insuranceField, schema, trainField } from './schema';
	import { Progress } from '$lib/components/ui/progress';
	import { ReportTable } from './_components';

	let progress = $state(0);
	let isLoading = $state(false);
	let isShowTable = $state(false);
	let activeTab = $state('flight');

	const form = superForm(defaults(zod(schema)), {
		SPA: true,
		validators: zod(schema),
		dataType: 'json',
		resetForm: false
	});

	let { form: formData, enhance, validateForm } = form;

	function isDateRangeEmpty(dateRange: { start: any; end: any }): boolean {
		return !dateRange.start && !dateRange.end;
	}

	const isNotValid = $derived(
		isDateRangeEmpty($formData.createdDate) &&
			isDateRangeEmpty($formData.ticketingDate) &&
			isDateRangeEmpty($formData.departureDate)
	);

	$effect(() => {
		if (activeTab) {
			isShowTable = false;
		}
	});

	const fieldList = $derived.by(() => {
		switch (activeTab) {
			case 'flight':
				return flightField;
			case 'hotel':
				return hotelField;
			case 'train':
				return trainField;
			default:
				return insuranceField;
		}
	});

	const simulateProgress = () =>
		new Promise<void>((resolve) => {
			let value = 0;
			const interval = setInterval(() => {
				value += Math.floor(Math.random() * 10) + 5;
				progress = Math.min(value, 100);
				if (progress >= 100) {
					clearInterval(interval);
					resolve();
				}
			}, 300);
		});

	async function handleSubmit() {
		isLoading = true;
		const result = await validateForm({ update: true });
		if (result.valid) {
			console.log($formData, 'formdata');
			await simulateProgress();
			isShowTable = true;
		} else {
			// toast.error('Please check your input');
		}
		isLoading = false;
	}
</script>

<div class="container mx-auto p-6">
	<div class="mb-4 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-semibold">Transaction Report</h1>
			<p class="text-muted-foreground text-sm">Download your transaction report</p>
		</div>
		<Button>
			<Icon icon="material-symbols:device-reset-rounded" />
			Download History
		</Button>
	</div>

	<Tabs.Root bind:value={activeTab} class="mb-10">
		<Tabs.List class="grid w-full grid-cols-4 gap-3 bg-white">
			<Tabs.Trigger class="trigger-item" value="flight">
				<Icon icon="lucide:plane" /> Flight
			</Tabs.Trigger>
			<Tabs.Trigger class="trigger-item" value="hotel">
				<Icon icon="mingcute:hotel-line" /> Hotel
			</Tabs.Trigger>
			<Tabs.Trigger class="trigger-item" value="train">
				<Icon icon="carbon:train-speed" /> Train
			</Tabs.Trigger>
			<Tabs.Trigger class="trigger-item" value="insurance"
				><Icon icon="stash:shield-duotone" /> Insurance
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>

	<Card class="gap-2 pt-3">
		<CardHeader>
			<h3 class="text-lg font-semibold capitalize">{activeTab}</h3>
		</CardHeader>
		<CardContent class="space-y-4 border-t pt-4">
			<form use:enhance onsubmit={() => handleSubmit()}>
				<div class="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<label for="created-at" class="mb-2 text-sm font-semibold">Created Date</label>
						<OSGPresetDatePicker
							triggerClass="w-full flex-auto"
							bind:value={$formData.createdDate}
							placeholder="Created Date"
						/>
					</div>
					<div>
						<label for="ticketing-date" class="mb-2 text-sm font-semibold">Ticketing Date</label>
						<OSGPresetDatePicker
							triggerClass="w-full flex-auto"
							bind:value={$formData.ticketingDate}
							placeholder="Ticketing Date"
						/>
					</div>
					<div>
						<label for="departure-date" class="mb-2 text-sm font-semibold">Departure Date</label>
						<OSGPresetDatePicker
							triggerClass="w-full flex-auto"
							bind:value={$formData.departureDate}
							placeholder="Departure Date"
						/>
					</div>
				</div>

				{#if isNotValid}
					<Alert.Root class="border-red-400 bg-red-100 p-2 text-red-700">
						<Info />
						<Alert.Title>
							Please fill at least one of the following: Created Date, Ticketing Date, or Departure
							Date
						</Alert.Title>
					</Alert.Root>
				{/if}

				<div class="mt-6 grid grid-cols-2 gap-x-4 border-t pt-6 md:grid-cols-4">
					{#each fieldList as field}
						{#if field.items?.length}
							<SelectField
								{form}
								bind:value={$formData[field.field]}
								name={field.field}
								label={field.label}
								placeholder={field.placeholder}
								items={field.items}
							/>
						{:else}
							<TextField
								{form}
								bind:value={$formData[field.field]}
								name={field.field}
								label={field.label}
								placeholder={field.placeholder}
							/>
						{/if}
					{/each}
				</div>

				<div class="flex justify-end">
					<Button type="submit" disabled={isNotValid}>Retrieve Data</Button>
				</div>
			</form>
		</CardContent>
	</Card>
	{#if isLoading}
		{@render LoadingSection()}
	{:else if isShowTable}
		<ReportTable {activeTab} />
	{/if}
</div>

{#snippet LoadingSection()}
	<Card class="mt-5" id="loading-section">
		<CardContent class="space-y-2">
			<h4 class="mb-4 text-lg font-semibold text-[#0F172A]">Retrieving Data...</h4>
			<Progress value={progress} class="h-4" />
			<p class="text-right text-sm text-[#1F2937]">{Math.floor(progress)}% Completed</p>
			<div class="mt-6 flex justify-end">
				<Button variant="outline">Cancel</Button>
			</div>
		</CardContent>
	</Card>
{/snippet}

<style>
	@reference '$appCss';
	:global {
		.trigger-item {
			@apply text-primary data-[state=active]:border-primary border-[#E0E0E0] py-2.5 text-base;
		}
	}
</style>
