<script>
	import Icon from '@iconify/svelte';
</script>

<div class="flex h-52 w-full items-center justify-between gap-3	 px-5">
	<div class="flex w-[40%] gap-3 flex-col">
		<span class="font-bold text-lg">Address</span>
		<span class="flex gap-2 text-sm">
			<Icon icon="mynaui:location" width="24" height="24" style="color: #000" />
			<span> Jl. Ir. H. Juanda No 3, Dago, Bandung, Jawa Barat, Indonesia, 40115 </span>
		</span>
	</div>
	<div class="relative h-44 w-[60%] bg-blue-200">
		<span
			class="absolute bottom-2 right-2 flex items-center justify-center rounded-md bg-white px-3 text-xs"
			>view on map</span
		>
	</div>
</div>
