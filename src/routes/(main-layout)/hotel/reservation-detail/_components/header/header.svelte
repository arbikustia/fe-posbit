<script>
	import Icon from '@iconify/svelte';
</script>

<div class="flex h-20 w-full items-start justify-between">
	<h1 class="text-xl font-bold">Reservation Detail</h1>
	<div class="flex gap-4">
		<button
			class="flex items-center gap-1 rounded-sm bg-white px-3 py-1 text-xs font-bold text-blue-500 shadow-md"
		>
			<Icon icon="mdi:share" width="20" height="20" style="color: #3f93e3" />
			Post to Opsicorp
		</button>
		<button
			class="flex items-center gap-1 rounded-sm bg-white px-3 py-1 text-xs font-bold text-blue-500 shadow-md"
		>
			<Icon icon="ion:ticket" width="18" height="18" style="color: #3f93e3" />
			Post to Back Offic
		</button>
		<button
			class="flex items-center gap-1 rounded-sm bg-white px-3 py-1 text-xs font-bold text-blue-500 shadow-md"
		>
			<Icon icon="material-symbols-light:download" width="20" height="20" style="color: #3f93e3" />
			Download
		</button>
		<div class="bg-gray-200 flex items-center justify-center px-1 rounded-sm shadow-md">
			<Icon icon="ph:dots-three-bold" width="20" height="20" style="color: #575757" />
		</div>
	</div>
</div>
