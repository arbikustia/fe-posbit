<!-- modified component -->
<script lang="ts">
	import * as FormPrimitive from 'formsnap';
	import { cn, type WithoutChild } from '$lib/utils.js';
	import { slide } from 'svelte/transition';

	let {
		ref = $bindable(null),
		class: className,
		errorClasses,
		children: childrenProp,
		...restProps
	}: WithoutChild<FormPrimitive.FieldErrorsProps> & {
		errorClasses?: string | undefined | null;
	} = $props();
</script>

<FormPrimitive.FieldErrors
	bind:ref
	class={cn('text-destructive min-h-[20px] text-sm font-medium', className)}
	{...restProps}
>
	{#snippet children({ errors, errorProps })}
		{#if childrenProp}
			{@render childrenProp({ errors, errorProps })}
		{:else}
			{#each errors as error (error)}
				<div
					{...errorProps}
					class={cn(errorClasses)}
					in:slide={{ duration: 200 }}
					out:slide={{ duration: 200 }}
				>
					{error}
				</div>
			{/each}
		{/if}
	{/snippet}
</FormPrimitive.FieldErrors>
