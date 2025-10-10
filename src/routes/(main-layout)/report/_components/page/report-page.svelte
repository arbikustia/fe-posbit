<script lang="ts">
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';
	import * as Pagination from '$lib/components/ui/pagination/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { goto } from '$app/navigation';
	import { onMount, tick } from 'svelte';
	import { fly } from 'svelte/transition';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import type { DateRange } from 'bits-ui';
	import {
		CalendarDate,
		DateFormatter,
		type DateValue,
		getLocalTimeZone
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';

	const fruits = [
		{ value: 'Yogyakarta', label: 'Yogyakarta' },
		{ value: 'Solo', label: 'Solo' },
		{ value: 'Semarang', label: 'Semarang' },
		{ value: 'Malang', label: 'Malang' }
	];

	let valueLocation = $state('');

	const triggerContent = $derived(fruits.find((f) => f.value === valueLocation)?.label ?? 'Select a Location');

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	let value: DateRange = $state({
		start: new CalendarDate(2022, 1, 20),
		end: new CalendarDate(2022, 1, 20).add({ days: 20 })
	});

	let startValue: DateValue | undefined = $state(undefined);

	let showSearch = false;
	let searchEl: HTMLInputElement | null = null;

	async function toggleSearch() {
		showSearch = !showSearch;
		if (showSearch) {
			await tick();
			searchEl?.focus();
		}
	}

	type Item = {
		item_code: string;
		item_name: string;
		weight_grams: number;
		price_per_gram: number;
		total: number;
	};

	type Transaction = {
		transaction_id: string;
		time: string;
		type: string;
		customer_name: string;
		cashier_name: string;
		branch_location: string;
		items: Item[];
		payment_method: string;
		total_amount: number;
		open?: boolean;
	};

	const transactions: Transaction[] = [
		{
			transaction_id: 'TRX-20251005-001',
			time: '05-10-2025 09:12',
			type: 'penjualan',
			customer_name: 'Dewi Kartika',
			cashier_name: 'Ardi Prasetyo',
			branch_location: 'Bandung',
			items: [
				{
					item_code: 'EM001',
					item_name: 'Cincin Emas 22K 2gr',
					weight_grams: 2.0,
					price_per_gram: 950000,
					total: 1900000
				}
			],
			payment_method: 'cash',
			total_amount: 1900000
		},
		{
			transaction_id: 'TRX-20251005-002',
			time: '05-10-2025 10:45',
			type: 'pembelian',
			customer_name: 'Roni Wijaya',
			cashier_name: 'Siti Nurhaliza',
			branch_location: 'Surabaya',
			items: [
				{
					item_code: 'EM005',
					item_name: 'Kalung Emas 23K 5gr',
					weight_grams: 5.0,
					price_per_gram: 960000,
					total: 4800000
				}
			],
			payment_method: 'transfer',
			total_amount: 4800000
		},
		{
			transaction_id: 'TRX-20251005-003',
			time: '05-10-2025 11:20',
			type: 'penjualan',
			customer_name: 'Lina Handayani',
			cashier_name: 'Budi Santoso',
			branch_location: 'Jakarta',
			items: [
				{
					item_code: 'EM007',
					item_name: 'Gelang Emas 23K 10gr',
					weight_grams: 10.0,
					price_per_gram: 980000,
					total: 9800000
				},
				{
					item_code: 'EM008',
					item_name: 'Anting Emas 22K 3gr',
					weight_grams: 3.0,
					price_per_gram: 940000,
					total: 2820000
				}
			],
			payment_method: 'debit',
			total_amount: 12620000
		}
	];

	function formatCurrency(num: number) {
		return new Intl.NumberFormat('id-ID', {
			style: 'currency',
			currency: 'IDR'
		}).format(num);
	}
</script>

<header class="mb-8">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Laporan Transaksi Kasir</h1>
	</div>

	<div class="relative mt-6 flex w-full flex-row justify-between gap-4 rounded-full">
		<div class="flex items-center gap-2">
			<Button
				onclick={() => goto('/master/report/create')}
				class="flex items-center justify-center rounded-lg px-4"
			>
				<Icon icon="pajamas:export" width="16" height="16" />
				Export
			</Button>
			<Select.Root type="single" name="favoriteFruit" bind:value={valueLocation}>
				<Select.Trigger class="w-[180px]">
					{triggerContent}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Label>Location</Select.Label>
						{#each fruits as fruit (fruit.value)}
							<Select.Item
								value={fruit.value}
								label={fruit.label}
							>
								{fruit.label}
							</Select.Item>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<div class="grid gap-2">
				<Popover.Root>
					<Popover.Trigger
						class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
					>
						<CalendarIcon class="mr-2 size-4" />
						{#if value && value.start}
							{#if value.end}
								{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
									value.end.toDate(getLocalTimeZone())
								)}
							{:else}
								{df.format(value.start.toDate(getLocalTimeZone()))}
							{/if}
						{:else if startValue}
							{df.format(startValue.toDate(getLocalTimeZone()))}
						{:else}
							Pick a date
						{/if}
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" align="start">
						<RangeCalendar
							bind:value
							onStartValueChange={(v) => {
								startValue = v;
							}}
							numberOfMonths={2}
						/>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>
		<div class="flex w-fit flex-row items-center justify-end gap-1 rounded-full">
			<div class="overflow-hidden">
				{#if showSearch}
					<input
						in:fly={{ x: 120, duration: 250 }}
						out:fly={{ x: 120, duration: 200 }}
						placeholder="Cari transaksi..."
						class="bg-primary/10 w-56 rounded-full border-none px-3 py-2 text-sm shadow-sm transition outline-none"
						bind:this={searchEl}
					/>
				{/if}
			</div>

			<button
				type="button"
				class="absolute right-0 rounded-full p-2 transition dark:hover:bg-gray-800"
				onclick={toggleSearch}
			>
				<Icon icon="majesticons:search-line" width="22" height="22" class="text-gray-600" />
			</button>
		</div>
	</div>
</header>

<div class="overflow-hidden rounded-lg border border-gray-200">
	<table class="w-full">
		<thead class="bg-gray-100">
			<tr class="text-left text-sm font-medium text-gray-700">
				<th class="px-4 py-3">No</th>
				<th class="px-4 py-3">Waktu</th>
				<th class="px-4 py-3">Jenis</th>
				<th class="px-4 py-3">Pelanggan</th>
				<th class="px-4 py-3">Kasir</th>
				<th class="px-4 py-3">Lokasi</th>
				<th class="px-4 py-3">Barang</th>
				<th class="px-4 py-3">Total</th>
				<th class="px-4 py-3">Pembayaran</th>
				<th class="px-4 py-3 text-center">Aksi</th>
			</tr>
		</thead>
		<tbody>
			{#each transactions as trx, index}
				<tr class="border-b border-gray-200 align-top text-sm hover:bg-gray-50">
					<td class="px-4 py-3 text-gray-500">{index + 1}</td>
					<td class="px-4 py-3">{trx.time}</td>
					<td class="px-4 py-3 capitalize">{trx.type}</td>
					<td class="px-4 py-3">{trx.customer_name}</td>
					<td class="px-4 py-3">{trx.cashier_name}</td>
					<td class="px-4 py-3">{trx.branch_location}</td>

					<!-- ITEMS -->
					<td class="px-4 py-3">
						<ul class="ml-4 list-disc">
							{#each trx.items as item}
								<li class="mb-1">
									<span class="font-medium">{item.item_name}</span><br />
									<small
										>{item.weight_grams}gr × {formatCurrency(item.price_per_gram)} =
										{formatCurrency(item.total)}</small
									>
								</li>
							{/each}
						</ul>
					</td>

					<td class="px-4 py-3">{formatCurrency(trx.total_amount)}</td>
					<td class="px-4 py-3 capitalize">{trx.payment_method}</td>
					<td class="px-4 py-3 text-center">
						<div class="flex items-center justify-center gap-2">
							<Icon
								icon="material-symbols-light:delete-rounded"
								width="20"
								height="20"
								class="cursor-pointer"
								style="color: #ff0f22"
							/>
							<Icon
								icon="lucide:edit"
								class="cursor-pointer"
								width="16"
								height="16"
								style="color: #cea200"
							/>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<Pagination.Root count={100} perPage={10}>
	{#snippet children({ pages, currentPage })}
		<div class="flex w-full justify-end">
			<Pagination.Content>
				<Pagination.Item><Pagination.PrevButton /></Pagination.Item>
				{#each pages as page (page.key)}
					{#if page.type === 'ellipsis'}
						<Pagination.Item><Pagination.Ellipsis /></Pagination.Item>
					{:else}
						<Pagination.Item>
							<Pagination.Link {page} isActive={currentPage === page.value}>
								{page.value}
							</Pagination.Link>
						</Pagination.Item>
					{/if}
				{/each}
				<Pagination.Item><Pagination.NextButton /></Pagination.Item>
			</Pagination.Content>
		</div>
	{/snippet}
</Pagination.Root>
