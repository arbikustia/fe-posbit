<script lang="ts">
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { relationships } from './constants';

	type RelationshipSelectProps = {
		value: string;
		disabled?: boolean;
	};

	let { value = $bindable(), disabled = false }: RelationshipSelectProps = $props();
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
	{#each relationships as relationship}
		<ToggleGroup.Item
			value={relationship.value}
			aria-label={`Toggle ${relationship.label}`}
			class="eq-toggle-item rounded-full! shadow-xs data-[state=on]:before:rounded-full! border-l!"
		>
			{relationship.label}
		</ToggleGroup.Item>
	{/each}
</ToggleGroup.Root>
