<script>
	import * as Select from '$lib/components/ui/select';
	import { countries } from './constants';

	let { value = $bindable(), ...props } = $props();

	const selectedCountryLabel = $derived.by(() => {
		if (value) {
			return countries.find((n) => n.value === value)?.label;
		}

		return 'Country of Issue';
	});
</script>

<Select.Root type="single" bind:value>
	<Select.Trigger
		class="data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive w-full"
		data-fs-error={props['data-fs-error']}
	>
		<span>{selectedCountryLabel}</span>
	</Select.Trigger>
	<Select.Content>
		{#each countries as country}
			<Select.Item value={country.value}>
				{country.label}
			</Select.Item>
		{/each}
	</Select.Content>
</Select.Root>
