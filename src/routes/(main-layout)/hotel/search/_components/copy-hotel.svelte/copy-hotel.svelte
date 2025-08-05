<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { getDeviceContext } from '$lib/context/device';
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import Toast from '../../../_components/toast/toast.svelte';

	export let items: Array<{
		name: string;
		location: string;
		price: number;
		rating: number;
		address: string;
	}> = [];

	let showToast = false;

	export let defaultLimit = 5;
	export let limitOptions = [5, 10, 20, 50];
	export let dialogTitle = 'Share to others';
	export let selectHotelLabel = 'Select Hotels';
	export let sendToLabel = 'Share via';

	const TARGET_PHONE_NUMBER = '0895605293775';

	const selected = writable<string[]>([]);
	let selectAll = false;
	let limit = defaultLimit;
	let isOpen = false;

	function formatItemsTextForWA(selectedItems: typeof items) {
		let formattedText = '';
		selectedItems.forEach((item, index) => {
			formattedText += `*${index + 1}. ${item.name}*\n`;
			formattedText += `_Rating:_ ${item.rating}.0\n`;
			formattedText += `_Alamat:_ ${item.address}\n`;
			formattedText += `_Harga mulai:_ *Rp${item.price.toLocaleString('id-ID')}*\n\n`;
		});
		return formattedText.trim();
	}

	onMount(() => {
		selected.set(items.slice(0, limit).map((item) => item.name));
		selectAll = true;
	});

	function toggleAll() {
		if (selectAll) selected.set(items.slice(0, limit).map((item) => item.name));
		else selected.set([]);
	}

	function toggleItem(itemName: string) {
		selected.update((arr) => {
			if (arr.includes(itemName)) return arr.filter((h) => h !== itemName);
			else return [...arr, itemName];
		});
	}

	function getSelectedItems() {
		return items.filter((item) => $selected.includes(item.name));
	}

	function formatItemsText(selectedItems: typeof items) {
		let formattedText = 'Hotel Available\n\n';

		selectedItems.forEach((item, index) => {
			formattedText += `#${index + 1} ${item.name}\n`;
			formattedText += `Rating: ${item.rating}.0\n`;
			formattedText += `Address: ${item.address}\n`;
			formattedText += `Start Price from ${item.price}\n`;

			if (index < selectedItems.length - 1) {
				formattedText += '\n---\n\n';
			}
		});

		return formattedText;
	}

	function copyToClipboard() {
		const selectedItems = getSelectedItems();
		if (selectedItems.length === 0) {
			alert('Please select at least one hotel');
			return;
		}

		let formattedText = '# Hotel Available\n\n' + formatItemsText(selectedItems);

		navigator.clipboard.writeText(formattedText).then(() => {
			showToast = true;
		});
	}

	function shareToEmail() {
		const selectedItems = getSelectedItems();
		if (selectedItems.length === 0) {
			alert('Please select at least one hotel');
			return;
		}

		let subject = 'Recommended Hotels';
		let body =
			'Here are some hotel recommendations:\n\n' +
			selectedItems
				.map(
					(item, index) =>
						`${index + 1}. ${item.name}\n` +
						`Rating: ${item.rating}.0\n` +
						`Address: ${item.address}\n` +
						`Price: ${item.price}\n`
				)
				.join('\n');

		window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
	}

	function shareToWhatsApp() {
		const selectedItems = getSelectedItems();
		if (selectedItems.length === 0) {
			alert('Please select at least one hotel');
			return;
		}
		const text = formatItemsTextForWA(selectedItems);
		navigator.clipboard.writeText(text).then(() => {
			showToast = true;
		});
	}

	function shareToTelegram() {
		const selectedItems = getSelectedItems();
		if (selectedItems.length === 0) {
			alert('Please select at least one hotel');
			return;
		}
		const text = formatItemsTextForWA(selectedItems);
		navigator.clipboard.writeText(text).then(() => {
			showToast = true;
		});
	}
	const shareMethods = [
		{
			name: 'Copy to Clipboard',
			icon: 'fluent:clipboard-link-24-regular',
			action: copyToClipboard
		},
		{
			name: 'E-mail',
			icon: 'logos:google-gmail',
			action: shareToEmail
		},
		{
			name: 'WhatsApp',
			icon: 'logos:whatsapp-icon',
			action: shareToWhatsApp
		},
		{
			name: 'Telegram',
			icon: 'logos:telegram',
			action: shareToTelegram
		}
	];
	const { isMobile } = getDeviceContext();
</script>

{#if isMobile}
	<Drawer.Root open={isOpen} onOpenChange={(val) => (isOpen = val)}>
		<Drawer.Trigger>
			<Icon icon="ic:baseline-share" width="24" height="24" style="color: #2b44d7" />
		</Drawer.Trigger>

		<Drawer.Portal>
			<Drawer.Content
				class="fixed bottom-0 left-0 right-0 z-50 max-h-[90vh] rounded-t-lg bg-white p-6"
			>
				<Drawer.Header>
					<Drawer.Title class="text-xl font-bold">{dialogTitle}</Drawer.Title>
				</Drawer.Header>

				<!-- Select Items -->
				<div class="mb-4">
					<h3 class="mb-2 font-semibold">{selectHotelLabel}</h3>
					<div class="max-h-48 overflow-y-auto rounded border p-3">
						<div class="mb-2 flex items-center gap-2">
							<input type="checkbox" bind:checked={selectAll} on:change={toggleAll} />
							<span>Select All</span>
						</div>
						{#each items.slice(0, limit) as item}
							<div class="mb-2 flex items-center gap-2">
								<input
									type="checkbox"
									checked={$selected.includes(item.name)}
									on:change={() => toggleItem(item.name)}
								/>
								<span>{item.name}</span>
							</div>
						{/each}
					</div>

					<!-- Toggle Select First X -->
					<div class="mt-4 flex items-center gap-2">
						<select bind:value={limit} class="rounded border px-2 py-1 text-sm">
							{#each limitOptions as num}
								<option value={num}>{num}</option>
							{/each}
						</select>
						<span>items.</span>
					</div>
				</div>

				<hr class="my-4" />

				<!-- Send To Options -->
				<div>
					<h3 class="mb-3 font-semibold">{sendToLabel}</h3>
					<div class="grid grid-cols-4 gap-4 text-center text-sm">
						{#each shareMethods as method}
							<div
								class="flex cursor-pointer flex-col items-center"
								on:click={method.action}
								on:keydown={(e) => e.key === 'Enter' && method.action()}
								tabindex="0"
								role="button"
							>
								<Icon icon={method.icon} width="28" />
								<span>{method.name}</span>
							</div>
						{/each}
					</div>
				</div>
			</Drawer.Content>
		</Drawer.Portal>
	</Drawer.Root>
{:else}
	<Dialog.Root>
		<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>
			<Icon icon="ic:baseline-share" width="24" height="24" style="color: #2b44d7" />
		</Dialog.Trigger>

		<Dialog.Content class="max-w-sm px-6">
			<div class="">
				<Dialog.Header>
					<Dialog.Title class="text-md mb-1 font-bold">
						{dialogTitle}
					</Dialog.Title>
				</Dialog.Header>

				<!-- Select Items -->
				<h3 class="mb-1 mt-2 flex items-center gap-2 text-sm font-semibold">
					<Icon icon="mage:dashboard-2" width="12" height="12" style="color: #020202" />
					{selectHotelLabel}
				</h3>
				<div class="max-h-32 overflow-y-auto rounded border p-3">
					<div class="mb-2 flex items-center gap-2">
						<input
							class="cursor-pointer"
							type="checkbox"
							bind:checked={selectAll}
							on:change={toggleAll}
						/>
						<span class="text-xs">Select All</span>
					</div>
					{#each items.slice(0, limit) as item}
						<div class="mb-2 flex items-center gap-2">
							<input
								class="cursor-pointer"
								type="checkbox"
								checked={$selected.includes(item.name)}
								on:change={() => toggleItem(item.name)}
							/>
							<span class="text-xs">{item.name}</span>
						</div>
					{/each}
				</div>

				<!-- Toggle Select First X -->
				<div class="mt-2 flex items-center gap-2">
					<select bind:value={limit} class="rounded border px-2 py-1 text-xs">
						{#each limitOptions as num}
							<option value={num}>{num}</option>
						{/each}
					</select>
					<span class="text-xs">items.</span>
				</div>
			</div>

			<hr class="" />

			<!-- Send To Options -->
			<div>
				<h3 class="mb-3 flex items-center gap-2 text-sm font-semibold">
					<Icon icon="majesticons:share" width="15" height="15" style="color: #7b7b7b" />
					{sendToLabel}
				</h3>
				<div class="flex justify-around gap-2 text-center text-sm">
					{#each shareMethods as method}
						<div
							class="flex cursor-pointer flex-col items-center justify-end gap-y-3"
							on:click={method.action}
							on:keydown={(e) => e.key === 'Enter' && method.action()}
							tabindex="0"
							role="button"
						>
							<Icon icon={method.icon} width="24" />
							<span class="text-xs">{method.name}</span>
						</div>
					{/each}
				</div>
			</div>
		</Dialog.Content>
	</Dialog.Root>
{/if}
<Toast bind:show={showToast} message="Copied to clipboard!" />
