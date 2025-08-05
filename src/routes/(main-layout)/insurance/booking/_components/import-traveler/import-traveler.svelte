<script lang="ts">
	import {
		OSGFileDropZone,
		MEGABYTE,
		type FileDropZoneProps
	} from '$lib/components/opsigo-ui/file-drop-zone';
	import { toast } from 'svelte-sonner';
	import { FormCard } from '../form-card';
	import { formatFileSize } from '$lib/helpers/file-helper';
	import * as XLSX from 'xlsx';
	import dayjs from 'dayjs';
	import type { ImportedTraveler } from './types';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import { useImportTraveler } from './import-traveler.svelte.js';

	let { value = $bindable() }: { value: ImportedTraveler[] } = $props();

	const { state, onUpload, onFileRejected } = useImportTraveler();

	$effect(() => {
		value = state.excelData;
	});
</script>

<FormCard title="Import Data">
	<div class="p-4">
		<OSGFileDropZone
			{onUpload}
			{onFileRejected}
			maxFileSize={2 * MEGABYTE}
			accept=".xlsx, .xls, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
		/>
		<div class="text-muted-foreground my-2 flex items-center justify-between text-xs">
			<p>Supported formats: .xlsx</p>
			<p>Maximum size: {formatFileSize(2 * MEGABYTE)}</p>
		</div>

		{#if state.file}
			<div class="mb-2 flex justify-between">
				<span>{state.file.name}</span>
				<span class="text-muted-foreground text-xs">{formatFileSize(state.file.size)}</span>
			</div>
		{/if}

		<div class="text-sm">
			<p>Download template or sample:</p>
			<ul class="list-inside list-disc">
				<li>
					<button type="button" class="text-primary">group-booking-template.xlsx</button>
				</li>
				<li>
					<button type="button" class="text-primary">group-booking-template.xlsx</button>
				</li>
			</ul>
		</div>
	</div>
</FormCard>

{#if value.length > 0}
	<FormCard>
		{#snippet header()}
			<div class="flex items-center gap-2">
				<h2 class="text-lg">List of Traveler</h2>
				<Badge variant="secondary">{value?.length}</Badge>
			</div>
		{/snippet}

		<Table.Root>
			<Table.Header>
				<Table.Row>
					<Table.Head>No</Table.Head>
					<Table.Head>Name</Table.Head>
					<Table.Head>Birth Date</Table.Head>
					<Table.Head>Age</Table.Head>
					<Table.Head>Birth Place</Table.Head>
					<Table.Head>Passport / KTP</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each value as traveler, i}
					{@const birthDate = dayjs(traveler.birthDate)}
					<Table.Row>
						<Table.Cell>{i + 1}</Table.Cell>
						<Table.Cell>{`${traveler.title} ${traveler.firstName} ${traveler.lastName}`}</Table.Cell
						>
						<Table.Cell>{birthDate.format('DD MMM YYYY')}</Table.Cell>
						<Table.Cell>{dayjs().diff(birthDate, 'year')}</Table.Cell>
						<Table.Cell>{traveler.birthPlace}</Table.Cell>
						<Table.Cell>{traveler.passportNumber}</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</FormCard>
{/if}
