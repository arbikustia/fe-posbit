<script lang="ts">
	import type { OtherActionItemProps } from './types';

	let { icon, label, onClick }: OtherActionItemProps = $props();
</script>

<button onclick={onClick} class="w-full py-2">
	<div class="flex items-center gap-x-2">
		{@render icon()}
		{label}
	</div>
</button>
