<!-- modified component -->
<script lang="ts">
	import * as FormPrimitive from 'formsnap';
	import { Label } from '$lib/components/ui/label/index.js';
	import { cn, type WithoutChild } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		children,
		class: className,
		required,
		...restProps
	}: WithoutChild<FormPrimitive.LabelProps> & {
		required?: boolean;
	} = $props();
</script>

<FormPrimitive.Label {...restProps} bind:ref>
	{#snippet child({ props })}
		<Label
			{...props}
			data-slot="form-label"
			class={cn('data-[fs-error]:text-destructive gap-1', className)}
		>
			{@render children?.()}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</Label>
	{/snippet}
</FormPrimitive.Label>
