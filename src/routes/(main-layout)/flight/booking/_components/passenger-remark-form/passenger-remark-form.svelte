<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Popover from '$lib/components/ui/popover';
	import Icon from '@iconify/svelte';
	import * as Command from '$lib/components/ui/command';
	import type { SuperForm } from 'sveltekit-superforms';
	import type { z } from 'zod';
	import type { bookingSchema } from '../page/schema';
	import * as Form from '$lib/components/ui/form';
	import { toast } from 'svelte-sonner';
	import { getPassengerFullName } from '../page/helpers';

	type PassengerRemarkFormProps = {
		form: SuperForm<z.infer<typeof bookingSchema>>;
		parentIdx: number;
	};

	const remarkOptions = Array(5)
		.fill(0)
		.map((_, i) => i + 1);

	let { form, parentIdx }: PassengerRemarkFormProps = $props();

	const { form: formData } = form;

	const passenger = $derived($formData.passengers[parentIdx]);

	function addRemark(idx: number) {
		const exist = passenger.remarks.find((remark) => remark.number === idx + 1);
		if (exist) {
			toast.error('Remark already added');
		} else {
			$formData.passengers[parentIdx].remarks = [
				...$formData.passengers[parentIdx].remarks,
				{
					number: idx + 1,
					value: ''
				}
			];
		}
	}
</script>

<div class="grid grid-cols-12 gap-4">
	<div class="col-span-3 flex gap-x-2">
		{parentIdx + 1}.
		<div class="mb-3 flex flex-col">
			<span class="mb-1 capitalize">{getPassengerFullName(passenger)}</span>
			<span class="text-sm capitalize text-gray-500">{passenger.ageGroup}</span>
		</div>
	</div>

	<div class="col-span-9 space-y-2">
		{#each $formData.passengers[parentIdx].remarks as _, i}
			<Form.ElementField {form} name="passengers[{parentIdx}].remarks[{i}].value">
				<Form.Control>
					{#snippet children({ props })}
						<div class="grid grid-cols-12 items-center gap-4">
							<div class="col-span-3 text-right text-sm">
								<Form.Label>Remark {$formData.passengers[parentIdx].remarks[i].number}</Form.Label>
							</div>
							<div class="col-span-9">
								<Input {...props} bind:value={$formData.passengers[parentIdx].remarks[i].value} />
							</div>
						</div>
					{/snippet}
				</Form.Control>
				<div class="grid grid-cols-12 items-center gap-4">
					<div class="col-span-3"></div>
					<div class="col-span-9">
						<Form.FieldErrors />
					</div>
				</div>
			</Form.ElementField>
		{/each}

		<div class="grid grid-cols-12 items-center gap-4">
			<div class="col-span-3"></div>
			<div class="col-span-9">
				<Popover.Root>
					<Popover.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
						<Icon icon="ic:baseline-plus" />
						Add Remark
					</Popover.Trigger>
					<Popover.Content align="start" class="w-fit p-0">
						<Command.Root>
							<Command.List>
								<Command.Group>
									{#each remarkOptions as remark, i}
										<Command.Item
											onSelect={() => {
												addRemark(i);
											}}
										>
											Remark {remark}
										</Command.Item>
									{/each}
								</Command.Group>
							</Command.List>
						</Command.Root>
					</Popover.Content>
				</Popover.Root>
			</div>
		</div>
	</div>
</div>
