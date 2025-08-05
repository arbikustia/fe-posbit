<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	let { flightType = $bindable() } = $props();
	let checked = $state(false);

	if (flightType === 'roundtrip') {
		checked = true;
	}

	$effect(() => {
		if (checked) {
			flightType = 'roundtrip';
		} else {
			flightType = 'oneway';
		}
	});
</script>

<div class=" flex items-center space-x-2 py-[3px]">
	<Checkbox id="returnCheckbox" bind:checked aria-labelledby="terms-label" />
	<Label id="return-label" for="returnCheckbox" class="cursor-pointer">Return</Label>
</div>
