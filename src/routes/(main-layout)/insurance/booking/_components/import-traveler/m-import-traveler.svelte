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
	import * as Drawer from '$lib/components/ui/drawer';
	import { ChevronRight } from '@lucide/svelte';
	import { cn } from '$lib/utils';

	let { value = $bindable() }: { value: ImportedTraveler[] } = $props();

	const { state, onUpload, onFileRejected } = useImportTraveler();

	$effect(() => {
		value = state.excelData;
	});
</script>

<div>
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

{#if value.length > 0}
	<Drawer.Root>
		<Drawer.Trigger type="button" class="w-full text-start">
			<div class={cn('bg-card w-full space-y-1 rounded-md p-2 pr-1 shadow-sm')}>
				<div class={cn('flex items-center justify-between')}>
					<p class="font-semibold capitalize">
						List of Traveler ({value.length})
					</p>

					<ChevronRight />
				</div>
			</div>
		</Drawer.Trigger>
		<Drawer.Content class="max-h-full border-none p-0">
			<Drawer.Header>
				<Drawer.Title class="capitalize">List of Traveler</Drawer.Title>
			</Drawer.Header>
			<div class="px-4">
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
								<Table.Cell
									>{`${traveler.title} ${traveler.firstName} ${traveler.lastName}`}</Table.Cell
								>
								<Table.Cell>{birthDate.format('DD MMM YYYY')}</Table.Cell>
								<Table.Cell>{dayjs().diff(birthDate, 'year')}</Table.Cell>
								<Table.Cell>{traveler.birthPlace}</Table.Cell>
								<Table.Cell>{traveler.passportNumber}</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>
		</Drawer.Content>
	</Drawer.Root>
{/if}
