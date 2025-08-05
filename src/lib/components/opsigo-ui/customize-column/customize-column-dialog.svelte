<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { ColumnItem, CustomizeColumnItem, defaultColumn, SavePresetSchema } from './type';
	import CustomizeColumnToolbar from './customize-column-toolbar.svelte';
	import CustomizeColumnTable from './customize-column-table.svelte';
	import CustomizeColumnPreview from './customize-column-preview.svelte';
	import SavePresetDialog from './save-preset-dialog.svelte';
	import type { Snippet } from 'svelte';

	let {
		defaultColumns = $bindable([]),
		keysActiveColumn,
		customDialog = $bindable(false),
		onApply,
		children
	}: {
		defaultColumns: ColumnItem[];
		keysActiveColumn: string[];
		customDialog: boolean;
		onApply: (val: string[], type: string, data?: defaultColumn) => void;
		children: Snippet;
	} = $props();

	let temporaryKeys: string[] = $state([]);
	let searchQuery = $state('');
	let presetDialog = $state(false);
	let columnAvailable = $state<CustomizeColumnItem[]>([]);

	$effect(() => {
		if (customDialog) setColumnAvailable(keysActiveColumn);
	});

	const setColumnAvailable = (keys: string[]) => {
		columnAvailable = defaultColumns
			.map((e) => ({
				...e,
				id: e.field,
				isActive: keys.length ? keys.some((k) => k === e.field) : true
			}))
			.sort((a, b) => {
				const indexA = keys.indexOf(a.field);
				const indexB = keys.indexOf(b.field);
				return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
			});
	};

	const handleShowHideAll = (isShow: boolean) => {
		columnAvailable = columnAvailable.map((e) => ({
			...e,
			isActive: isShow
		}));
	};

	const onAction = (type: string) => {
		if (type !== 'cancel') {
			const findKeys = columnAvailable.filter((e) => e.isActive === true).map((e) => e.field);
			console.log(findKeys.length)
			if (!findKeys.length) return;
			if (type === 'apply') {
				onApply(findKeys, type);
				customDialog = false;
			} else {
				temporaryKeys = findKeys;
				presetDialog = true;
			}
		} else {
			customDialog = false;
		}
	};

	const onSavePresetSuccess = (data: SavePresetSchema) => {
		onApply(temporaryKeys, 'save', {
			id: Number(Math.random().toString(36).slice(2, 10)),
			...data,
			keysColumn: temporaryKeys
		});
		presetDialog = false;
		customDialog = false;
	};
</script>

{@render children()}

<Dialog.Root bind:open={customDialog}>
	<Dialog.Content class="sm:max-w-[900px]">
		<Dialog.Header>
			<Dialog.Title>Customize Column</Dialog.Title>
			<CustomizeColumnToolbar
				bind:searchQuery
				showHideAll={(e) => handleShowHideAll(e)}
				reset={() => setColumnAvailable(keysActiveColumn)}
			/>
		</Dialog.Header>
		<div class="customize-content custom-scrollbar">
			<!-- available column -->
			<CustomizeColumnTable {searchQuery} bind:columnAvailable />

			<!-- preview column -->
			<CustomizeColumnPreview {columnAvailable} />
		</div>
		<Dialog.Footer>
			<Button type="button" onclick={() => onAction('cancel')} variant="outline">Cancel</Button>
			<Button
				type="button"
				onclick={() => onAction('save')}
				variant="outline"
				class="border-primary text-primary">Save Preset</Button
			>
			<Button type="button" onclick={() => onAction('apply')}>Apply changes</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<SavePresetDialog bind:isDialog={presetDialog} onsuccess={onSavePresetSuccess} />

<style>
	@reference "$appCss";
	.customize-content {
		@apply flex h-[calc(100vh-200px)] gap-4 overflow-x-auto py-4;
	}
	:global {
		.config-info {
			@apply flex items-center justify-between;
		}
		.config-info > h1 {
			@apply text-lg font-semibold;
		}
		.config-info > .badge {
			@apply rounded-md bg-[#F1F5F9] px-2 py-1 text-sm font-semibold;
		}
	}
</style>
