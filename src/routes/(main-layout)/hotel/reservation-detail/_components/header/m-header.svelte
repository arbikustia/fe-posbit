<script>
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import Icon from '@iconify/svelte';
	import { ReseevedBadge } from './_components';
</script>

<MOSGAppBar class="border-grey-300 flex h-16 items-start border text-black shadow-none">
	{#snippet leftContent()}
		<div class="flex w-[50vw] flex-col justify-start">
			<span class="text-lg font-bold">The 101 Bandung </span>
			<span class="flex items-center gap-1 text-xs text-gray-600">
				<span>Book Code</span>
				<span class="font-bold text-blue-400">HAHTHAJAHSHTJABJKA</span>
				<span>
					<Icon icon="cil:copy" width="12" height="12" style="color: #535353" />
				</span>
			</span>
		</div>
	{/snippet}
	{#snippet rightContent()}
		<ReseevedBadge />
	{/snippet}
</MOSGAppBar>
