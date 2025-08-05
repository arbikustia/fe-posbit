<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import Icon from '@iconify/svelte';

	let {
		form = null,
		label = '',
		value = $bindable([]),
		name,
		required = false,
		placeholder = 'Type a tag...'
	}: {
		form: any;
		label?: string;
		value: string[];
		name: string;
		required?: boolean;
		placeholder?: string;
	} = $props();

	let inputValue = $state('');

	function addTag() {
		const trimmedValue = inputValue.trim();
		if (trimmedValue && !value.includes(trimmedValue)) {
			value = [...value, trimmedValue];
			inputValue = '';
		}
	}

	function removeTag(tagToRemove: string) {
		value = value.filter((tag) => tag !== tagToRemove);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			addTag();
		}
	}
</script>

<Form.Field {form} {name}>
	<Form.Control>
		{#snippet children({ props })}
			{#if label}<Form.Label {required}>{label}</Form.Label>{/if}
			<div class="space-y-2">
				<Input {...props} bind:value={inputValue} {placeholder} onkeydown={handleKeydown} />
				<p class="text-muted-foreground text-sm">Press Enter to add tags</p>
				{#if value.length > 0}
					<div class="flex flex-wrap gap-2">
						{#each value as tag (tag)}
							<Badge variant="secondary" class="flex items-center gap-1 px-2 py-1 capitalize">
								{tag}
								<button onclick={() => removeTag(tag)}>
									<Icon icon="mdi:times" class="mt-0.5 text-base" />
								</button>
							</Badge>
						{/each}
					</div>
				{/if}
			</div>
		{/snippet}
	</Form.Control>
	<Form.FieldErrors />
</Form.Field>
