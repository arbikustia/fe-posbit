<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';
	import { slide } from 'svelte/transition';
	import { TrainCardClass } from '../train-card-class';

	const tdClass = 'pr-4 py-1';

	let { isLast = false } = $props();
</script>

<tr class={cn('border-primary cursor-pointer', { 'border-b': !isLast })} transition:slide>
	<td class={cn(tdClass, 'pl-2')}> Argo Parahyangan </td>
	<td class={tdClass}> KA-137 </td>
	<td class={tdClass}> 06:10 </td>
	<td class={tdClass}>
		<p class="text-nowrap">06:10 <sup>+1</sup></p>
	</td>
	<td class={tdClass}>4h 10m</td>

	<td class={cn(tdClass, 'px-2')}>
		<TrainCardClass value="1" />
	</td>

	<td class={cn(tdClass, 'text-end font-semibold')}>
		<Button
			onclick={(e) => {
				e.stopPropagation();
			}}
			size="sm"
			class="ml-4 px-4">Select</Button
		>
	</td>
</tr>
