<script lang="ts">
	import { RadioGroupField, TextField } from '$lib/components/opsigo-ui/input';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import z from 'zod';
	import { savePresetSchema } from './schema';
	import type { SavePresetSchema } from './type';

	let {
		isDialog = $bindable(false),
		onsuccess
	}: { isDialog: boolean; onsuccess: (data: SavePresetSchema) => void } = $props();

	const optionTypes = [
		{ value: 'user', label: 'User Company (PT. Rekasineri Pratama)' },
		{ value: 'self', label: 'Self' },
		{ value: 'all', label: 'All Company (Child)' }
	];

	const form = superForm(defaults(zod(savePresetSchema)), {
		SPA: true,
		validators: zod(savePresetSchema),
		dataType: 'json',
		resetForm: false
	});

	let { form: formData, enhance, validateForm, reset } = form;

	const handleSubmit = async () => {
		const result = await validateForm({ update: true });
		console.log({ result });
		if (result.valid) {
			console.log($formData, 'formdata');
			onsuccess($formData);
			reset();
		} else {
			// toast.error('Please check your input');
		}
	};
</script>

<Dialog.Root bind:open={isDialog}>
	<Dialog.Content class="sm:max-w-[400px]">
		<form use:enhance onsubmit={() => handleSubmit()}>
			<TextField
				{form}
				bind:value={$formData.presetName}
				name="presetName"
				label="Preset Name"
				placeholder="Type Preset Name"
			/>
			<RadioGroupField
				{form}
				bind:value={$formData.access}
				label="Access"
				name="access"
				items={optionTypes}
			/>

			<Button type="submit" class="w-full">Submit</Button>
		</form>
		<!-- <Dialog.Footer>
			<Button type="button" class="w-full">Submit</Button>
		</Dialog.Footer> -->
	</Dialog.Content>
</Dialog.Root>
