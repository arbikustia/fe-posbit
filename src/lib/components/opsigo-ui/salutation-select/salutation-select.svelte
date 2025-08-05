<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';

	type TitleSelectProps = {
		value: string;
		isAdult?: boolean;
		disabled?: boolean;
	};

	const titleOptions = [
		{ label: 'MR', value: 'mr' },
		{ label: 'MRS', value: 'mrs' },
		{ label: 'MS', value: 'ms' }
	];

	let { value = $bindable(), isAdult = true, disabled = false }: TitleSelectProps = $props();

	if (!isAdult) {
		titleOptions.splice(1, 1);
	}
</script>

<ToggleGroup.Root
	bind:value={
		() => value,
		(newValue) => {
			if (newValue !== '') {
				return (value = newValue);
			}
		}
	}
	variant="outline"
	type="single"
	class="eq-toggle-root shadow-none! gap-2"
	loop={false}
	{disabled}
>
	{#each titleOptions as titleOption}
		<ToggleGroup.Item
			value={titleOption.value}
			aria-label={`Toggle ${titleOption.label}`}
			class="eq-toggle-item rounded-full! shadow-xs data-[state=on]:before:rounded-full! border-l!"
		>
			{titleOption.label}
		</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>
