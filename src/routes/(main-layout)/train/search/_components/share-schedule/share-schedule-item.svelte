<script lang="ts">
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { formatThousand } from '$lib/helpers/number-helper';
</script>

<div class="border-b p-2">
	<div class="flex items-center gap-4">
		<div class="w-4">
			<Checkbox />
		</div>
		<div class="flex flex-col">
			<p class="text-sm font-semibold">ARGO PARAHYANGAN</p>
			<p class="text-xs">KA-137</p>
		</div>
		<div class="mx-auto flex items-center gap-4">
			<div class="text-center text-sm">
				<p class="font-semibold">06:10</p>
				<p>GMR</p>
			</div>
			<div class="w-10 text-center text-xs text-muted-foreground">4h 10m</div>
			<div class="text-center text-sm">
				<p class="font-semibold">10:00</p>
				<p>BD</p>
			</div>
		</div>
		<div class="ml-auto min-w-24 text-end">
			<p class="text-xs text-muted-foreground">Economy (A)</p>
			<p class="text-sm font-semibold text-primary">
				{formatThousand(180000)}
				IDR
			</p>
		</div>
	</div>
</div>
