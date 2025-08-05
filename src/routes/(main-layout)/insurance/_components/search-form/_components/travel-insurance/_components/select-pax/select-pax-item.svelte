<script lang="ts">
	import Icon from '@iconify/svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	let { value = $bindable(), paxType, ageInfo, iconPaxType, onChange } = $props();

	function disableMinButton() {
		if (paxType === 'Adult') {
			return value === 1;
		}
		return value === 0;
	}
</script>

<div class="flex items-center">
	<div class="text-muted-foreground">
		{@render iconPaxType()}
	</div>

	<div class="ml-3">
		<div class="text-sm">{paxType}</div>
		<div class="text-xs text-muted-foreground">{ageInfo}</div>
	</div>
	<div class="ml-auto flex items-center">
		<Button
			variant="outline"
			size="icon"
			onclick={() => onChange(-1)}
			disabled={disableMinButton()}
		>
			<Icon icon="stash:minus-solid" />
		</Button>
		<div class="w-[50px] text-center text-lg font-semibold">{value}</div>
		<Button variant="outline" size="icon" onclick={() => onChange(1)}>
			<Icon icon="stash:plus-solid" />
		</Button>
	</div>
</div>
