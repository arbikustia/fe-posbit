<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { cn } from '$lib/utils';
	import type { PrefixedInputProps } from './types';

	let {
		ref = $bindable(null),
		value = $bindable(),
		class: className,
		inputPrefix,
		prefixWrapperClass,
		...restProps
	}: PrefixedInputProps & { prefixWrapperClass?: string } = $props();
</script>

<div
	bind:this={ref}
	class={cn(
		'border-input shadow-xs focus-within:ring-ring flex h-10 w-full rounded-md border bg-white transition-colors focus-within:ring-2 focus-within:ring-offset-2',
		//data error
		'data-fs-error:border-destructive data-fs-error:focus-within:ring-destructive',
		{ 'opacity-50': restProps.disabled },
		className
	)}
	data-fs-error={restProps['data-fs-error']}
>
	<div class={cn('flex items-center rounded-l-md bg-gray-100 px-2', prefixWrapperClass)}>
		{@render inputPrefix()}
	</div>

	<Input
		class="h-full rounded-l-none border-none bg-transparent shadow-none transition-none focus-visible:ring-0 focus-visible:ring-offset-0"
		bind:ref
		bind:value
		{...restProps}
	/>
</div>
