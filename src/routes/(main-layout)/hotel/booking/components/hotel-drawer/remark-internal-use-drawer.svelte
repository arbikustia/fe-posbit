<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Form from '$lib/components/ui/form';
	import { Document } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import { formatFileSize } from '$lib/helpers/file-helper';
	import { Upload, X } from '@lucide/svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { bookingSchema } from '../page/schema';


	let isOpenSearchPanel = $state(false);
	function openSearchPanel() {
		isOpenSearchPanel = true;
	}

	type BookingContactProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: BookingContactProps = $props();

	const { form: formData } = form;

	let accordionValue = $state('item-1');

	const isAccordionOpen = $derived(accordionValue !== '');

	function addRemark(guestIndex: number) {
		const remarks = [...$formData.guests[guestIndex].remarks];
		remarks.push({
			number: $formData.guests[guestIndex].remarks.length + 1,
			value: '',
			file: null
		});

		$formData.guests[guestIndex].remarks = remarks;
	}

	function handleFileUpload(event: Event, guestIndex: number, remarkIndex: number) {
		const input = event.target as HTMLInputElement;
		if (input.files && input.files.length > 0) {
			$formData.guests[guestIndex].remarks[remarkIndex].file = input.files[0];
		}
	}

	function removeFile(guestIndex: number, remarkIndex: number) {
		$formData.guests[guestIndex].remarks[remarkIndex].file = null;
	}
</script>

<div class="mt-10">
	<span class="font-semibold">Remarks for Internal Use</span>
</div>
<div class="mt-3 space-y-3">
	<div class="flex flex-col gap-3">
		<button
			onclick={openSearchPanel}
			class="flex h-10 items-center justify-between rounded-md border border-gray-700 px-3"
		>
			<span>Mr. John Doe </span>
			<Icon icon="weui:arrow-filled" width="20" height="30" style="color: #7b7b7b" />
		</button>
		<button
			onclick={openSearchPanel}
			class="flex h-10 items-center justify-between rounded-md border border-gray-700 px-3"
		>
			<span>Guest 2</span>
			<Icon icon="weui:arrow-filled" width="20" height="30" style="color: #7b7b7b" />
		</button>
	</div>
</div>

<Drawer.Root bind:open={isOpenSearchPanel}>
	<Drawer.Content class="p-4">
		<Drawer.Header>
			<Drawer.Title>Remarks for Internal Use</Drawer.Title>
		</Drawer.Header>
		<div class="space-y-2 h-96 overflow-y-auto">
			{#each $formData.guests as guest, guestIdx}
				<Form.Fieldset {form} name="guests[{guestIdx}].remarks">
					<div class="space-y-4">
						<h3 class="font-medium">
							Guest {guestIdx + 1}
						</h3>

						{#each guest.remarks as remark, remarkIdx}
							<div class="space-y-3">
								<div class="flex gap-4">
									<div class="flex-1">
										<Form.ElementField {form} name="guests[{guestIdx}].remarks[{remarkIdx}].value">
											<Form.Control>
												{#snippet children({ props })}
													<Input
														{...props}
														bind:value={$formData.guests[guestIdx].remarks[remarkIdx].value}
														placeholder="Remark {remarkIdx + 1}"
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors class="min-h-0" />
										</Form.ElementField>
									</div>
									<div class="flex-none">
										<Button
											variant="outline"
											class="relative flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
										>
											<Upload class="h-4 w-4" />
											<span>{remark.file ? 'Change File' : 'Add File'}</span>
											<input
												type="file"
												class="absolute inset-0 cursor-pointer opacity-0"
												onchange={(e) => handleFileUpload(e, guestIdx, remarkIdx)}
											/>
										</Button>
									</div>
								</div>

								{#if remark.file}
									<div
										class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2"
									>
										<div class="flex items-center gap-3">
											<Document />
											<div>
												<p class="text-sm font-medium text-gray-700">{remark.file.name}</p>
												<p class="text-xs text-gray-500">{formatFileSize(remark.file.size)}</p>
											</div>
										</div>
										<button
											type="button"
											class="text-gray-400 hover:text-gray-500"
											onclick={() => removeFile(guestIdx, remarkIdx)}
										>
											<X class="h-4 w-4" />
										</button>
									</div>
								{/if}
							</div>
						{/each}

						{#if $formData.guests[guestIdx].remarks.length < 8}
							<div class="flex justify-end">
								<Button
									variant="outline"
									class="border-gray-300 bg-gray-50 hover:bg-gray-100"
									onclick={() => addRemark(guestIdx)}
								>
									+ Add Remark
								</Button>
							</div>
						{/if}
					</div>
				</Form.Fieldset>
			{/each}
		</div>
	</Drawer.Content>
</Drawer.Root>
