<script>
	import * as Select from '$lib/components/ui/select';
	import { nationalities } from './constants';

	let { value = $bindable(), ...props } = $props();

	const selectedNationalityLabel = $derived.by(() => {
		if (value) {
			return nationalities.find((n) => n.value === value)?.label;
		}

		return 'Nationality';
	});
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger
		class="data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive w-full"
		data-fs-error={props['data-fs-error']}
	>
		<span>{selectedNationalityLabel}</span>
	</Select.Trigger>
	<Select.Content>
		{#each nationalities as nationality}
			<Select.Item value={nationality.value}>
				{nationality.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
