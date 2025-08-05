<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	import {
		flightColumnDefault,
		flightColumnPresets,
		hotelColumnDefault,
		hotelColumnPresets,
		insuranceColumnDefault,
		trainColumnDefault,
		trainColumnPresets
	} from './dummy-column';
	import { flightTableRows, hotelTableRows, insuranceTableRows, trainTableRows } from './dummy-data';
	import {
		CustomizeColumnActions,
		CustomizeColumnDialog
	} from '$lib/components/opsigo-ui/customize-column';
	import type { ColumnItem, defaultColumn } from '$lib/components/opsigo-ui/customize-column/type';
	import { onMount } from 'svelte';

	let { activeTab } = $props();
	type ColumnKey = ColumnItem['field'];
	type Row = Record<ColumnKey, string | number | boolean | null | undefined>;

	let keysActiveColumn = $state<string[]>([]); // key defaultnya preset, yang ga diubah2, buat reset default
	let selectedKeys: string[] = $state([]); // key yang terpilih
	let customDialog = $state(false);
	let presetTable = $state<defaultColumn[]>(flightColumnPresets);
	let defaultColumns = $state<ColumnItem[]>(flightColumnDefault);
	let selectedType = $state('');
	let tableRows: Row[] = $state(flightTableRows);

	const tableColumns = $derived.by(() => {
		let temp = [];
		for (let i = 0; i < selectedKeys.length; i++) {
			const key = selectedKeys[i];
			const data = defaultColumns.find((e) => e.field === key);
			if (data) temp.push(data);
		}
		return temp.length ? temp : defaultColumns;
	});

	onMount(() => {
		if (activeTab === 'flight') {
			presetTable = flightColumnPresets;
			defaultColumns = flightColumnDefault;
			tableRows = flightTableRows;
		} else if (activeTab === 'hotel') {
			presetTable = hotelColumnPresets;
			defaultColumns = hotelColumnDefault;
			tableRows = hotelTableRows;
		} else if (activeTab === 'train') {
			presetTable = []; //trainColumnPresets;
			defaultColumns = trainColumnDefault;
			tableRows = trainTableRows;
		} else if (activeTab === 'insurance') {
			presetTable = [];
			defaultColumns = insuranceColumnDefault;
			tableRows = insuranceTableRows;
		}
	});

	const onApplyColumn = (keys: string[], type: string, newPreset?: defaultColumn) => {
		if (type === 'save' && newPreset) {
			console.log('saveToDB', newPreset);
			presetTable.push(newPreset);
			selectedType = newPreset.presetName;
		}
		selectedKeys = keys;
	};
</script>

<Card.Root class="mt-6 gap-2 pt-3">
	<Card.Header class="flex items-center justify-between gap-3">
		<div class="flex-auto">
			<h1 class="text-lg font-semibold">
				Review Report <span class="ml-2 rounded-[10px] bg-[#F1F5F9] px-2 py-1 text-base">70</span>
			</h1>
			<p class="text-muted-foreground text-sm">
				Drag columns to reorder or click the eye icon to show/hide columns
			</p>
		</div>

		<CustomizeColumnDialog
			{defaultColumns}
			bind:customDialog
			{keysActiveColumn}
			onApply={onApplyColumn}
		>
			<CustomizeColumnActions
				bind:customDialog
				bind:selectedKeys
				bind:keysActiveColumn
				bind:selectedType
				{presetTable}
			/>
		</CustomizeColumnDialog>

		<Button>
			<Icon icon="material-symbols:download" />
			Download
		</Button>
	</Card.Header>
	<Card.Content class="space-y-4 border-t pt-4">
		{@render tableReport()}
	</Card.Content>
</Card.Root>

{#snippet tableReport()}
	<div class="overflow-x-scroll rounded-lg border border-gray-200">
		<table class="w-max min-w-full table-auto">
			<thead class="bg-gray-100">
				<tr class="text-left text-sm font-medium text-gray-700">
					{#each tableColumns as column (column.index)}
						<th class="w-max px-4 py-3">{column.header}</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each tableRows as row}
					<tr class="border-b border-gray-200 text-sm hover:bg-gray-50">
						{#each tableColumns as column (column.index)}
							<td class="w-max px-4 py-3">{row[column.field]}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{/snippet}
