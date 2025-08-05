<script lang="ts">
	import Icon from '@iconify/svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { SuperForm } from 'sveltekit-superforms';
	import { z } from 'zod';
	import { Alert, AlertDescription } from '$lib/components/ui/alert';
	import { bookingSchema } from '../page/schema';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Select from '$lib/components/ui/select';
	import { AlertCircle } from '@lucide/svelte';

	let isOpenSearchPanel = $state(false);
	function openSearchPanel() {
		isOpenSearchPanel = true;
	}

	const bedTypes = [
		{
			value: 'single',
			label: 'Single'
		},
		{
			value: 'double',
			label: 'Double'
		},
		{
			value: 'twin',
			label: 'Twin'
		},
		{
			value: 'king',
			label: 'King'
		}
	];

	type BookingContactProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
	};

	let { form }: BookingContactProps = $props();

	const { form: formData } = form;

	let accordionValue = $state('item-1');

	const isAccordionOpen = $derived(accordionValue !== '');
</script>

<div class="mt-10">
	<span class="font-semibold">Remarks for Hotel</span>
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
			<Drawer.Title>Remarks for Hotel</Drawer.Title>
		</Drawer.Header>
		<div>
			<Alert class="rounded-none bg-primary/10 text-primary">
				<AlertCircle class="h-4 w-4 text-red-500!" />
				<AlertDescription>
					Any Remarks for Hotel will be requested to the hotel but it is not guaranteed. All
					requests are subject to hotel's availability and may incur additional charges on the guest
					account.
				</AlertDescription>
			</Alert>

			<div class="h-[600px] overflow-auto">
				{#each $formData.remarksHotel as remark, index}
					<div>
						<div class="border-y border-gray-200 bg-gray-50 p-4 py-2">
							<h3 class="flex items-center gap-2 font-medium">
								Room
								<span
									class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground"
								>
									{index + 1}
								</span>
							</h3>
						</div>

						<div class="p-4">
							<div class="space-y-6">
								<div class="flex flex-col items-start gap-x-8 gap-y-4">
									<!-- Bed Type -->
									<div class="space-y-4">
										<div class="flex items-center gap-2">
											<Checkbox
												id="bedType-{index}"
												bind:checked={$formData.remarksHotel[index].bedType}
											/>
											<Label for="bedType-{index}">Bed Type</Label>
										</div>
										{#if remark.bedType}
											<div class="pl-6">
												<Form.Field {form} name="remarksHotel[{index}].bedTypeValue">
													<Form.Control>
														{#snippet children({ props })}
															<Select.Root
																type="single"
																bind:value={$formData.remarksHotel[index].bedTypeValue}
															>
																<Select.Trigger
																	class="w-[180px] data-fs-error:border-destructive data-fs-error:focus-visible:ring-destructive"
																	{...props}
																>
																	{bedTypes.find((f) => f.value === remark.bedTypeValue)?.label ??
																		'Select a Bed Type'}
																</Select.Trigger>
																<Select.Content>
																	<Select.Group>
																		{#each bedTypes as bedType (bedType.value)}
																			<Select.Item value={bedType.value} label={bedType.label}
																				>{bedType.label}</Select.Item
																			>
																		{/each}
																	</Select.Group>
																</Select.Content>
															</Select.Root>
														{/snippet}
													</Form.Control>
													<Form.FieldErrors class="min-h-0" />
												</Form.Field>
											</div>
										{/if}
									</div>

									<!-- Non-Smoking Room -->
									<div class="flex items-center gap-2">
										<Checkbox
											id="nonSmokingRoom-{index}"
											bind:checked={$formData.remarksHotel[index].nonSmokingRoom}
										/>
										<Label for="nonSmokingRoom-{index}">Non-Smoking Room</Label>
									</div>

									<!-- Check-in Time -->
									<div class="space-y-4">
										<div class="flex items-center gap-2">
											<Checkbox
												id="checkInTime-{index}"
												bind:checked={$formData.remarksHotel[index].checkInTime}
											/>
											<Label for="checkInTime-{index}">Check-in Time</Label>
										</div>
										{#if remark.checkInTime}
											<div class="pl-6">
												<Form.Field {form} name="remarksHotel[{index}].checkInTimeValue">
													<Form.Control>
														{#snippet children({ props })}
															<input
																{...props}
																type="time"
																class="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-fs-error:border-destructive data-fs-error:focus-visible:ring-destructive"
																bind:value={$formData.remarksHotel[index].checkInTimeValue}
															/>
														{/snippet}
													</Form.Control>
													<Form.FieldErrors class="min-h-0" />
												</Form.Field>
											</div>
										{/if}
									</div>

									<!-- Check-out Time -->
									<div class="space-y-4">
										<div class="flex items-center gap-2">
											<Checkbox
												id="checkOutTime-{index}"
												bind:checked={$formData.remarksHotel[index].checkOutTime}
											/>
											<Label for="checkOutTime-{index}">Check-out Time</Label>
										</div>
										{#if remark.checkOutTime}
											<div class="pl-6">
												<Form.Field {form} name="remarksHotel[{index}].checkOutTimeValue">
													<Form.Control>
														{#snippet children({ props })}
															<input
																{...props}
																type="time"
																class="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-fs-error:border-destructive data-fs-error:focus-visible:ring-destructive"
																bind:value={$formData.remarksHotel[index].checkOutTimeValue}
															/>
														{/snippet}
													</Form.Control>
													<Form.FieldErrors class="min-h-0" />
												</Form.Field>
											</div>
										{/if}
									</div>

									<!-- Other -->
									<div class="flex items-center gap-2">
										<Checkbox
											id="other-{index}"
											bind:checked={$formData.remarksHotel[index].other}
										/>
										<Label for="other-{index}">Other</Label>
									</div>

									<!-- High Floor -->
									<div class="flex items-center gap-2">
										<Checkbox
											id="highFloor-{index}"
											bind:checked={$formData.remarksHotel[index].highFloor}
										/>
										<Label for="highFloor-{index}">High Floor</Label>
									</div>
								</div>

								{#if remark.other}
									<div class="relative">
										<Form.Field {form} name="remarksHotel[{index}].otherValue">
											<Form.Control>
												{#snippet children({ props })}
													<Textarea
														{...props}
														bind:value={$formData.remarksHotel[index].otherValue}
														placeholder="Enter other remarks"
														rows={4}
														maxlength={200}
														class="resize-none pr-16 data-fs-error:border-destructive data-fs-error:focus-visible:ring-destructive"
													/>
													<span class="absolute bottom-2 right-2 text-xs text-gray-500">
														{remark?.otherValue?.length ?? 0}/200
													</span>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors class="min-h-0" />
										</Form.Field>
									</div>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
