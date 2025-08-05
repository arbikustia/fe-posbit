<script>
	import * as Drawer from '$lib/components/ui/drawer';
	import Icon from '@iconify/svelte';
	import TooltipInfo from '../../review-reservation/_components/tooltip-info/tooltip-info.svelte';
	let isOpenSearchPanel = $state(false);
	function openSearchPanel() {
		isOpenSearchPanel = true;
	}
</script>

<button
	onclick={openSearchPanel}
	class="flex cursor-pointer flex-col items-start justify-start gap-3 rounded-lg border border-gray-700 p-2 py-5"
>
	<div class="flex w-full items-center justify-between">
		<div>
			<p>The 101 Bandung</p>
			<div class="flex">
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
			</div>
		</div>
		<Icon icon="weui:arrow-filled" width="20" height="38" style="color: #7b7b7b" />
	</div>
	<div class="text-start">Jl. Ir. H. Juanda No. 3 , Dago,Bandung,Jawa Barat, Indonesia, 40115</div>
	<div class="flex w-full flex-col items-start justify-start">
		<div class="flex w-[80%] justify-between">
			<span class="font-semibold">Check-in</span>
			<span>Tue, 11 March 2025</span>
		</div>
		<div class="flex w-[80%] justify-between">
			<span class="font-semibold">Check-out</span>
			<span>Wed, 12 March 2025</span>
		</div>
	</div>
	<p class="font-semibold">2 Delux Room</p>
</button>

<Drawer.Root bind:open={isOpenSearchPanel}>
	<Drawer.Content class="p-4">
		<Drawer.Header>
			<Drawer.Title>Hotel Detail</Drawer.Title>
		</Drawer.Header>
		<div class="max-h-[70vh] space-y-7">
			<div class="flex w-full justify-center">
				<div class="h-36 w-[90%] rounded-md bg-gray-600"></div>
			</div>

			<div>
				<div class="flex w-full flex-col items-start justify-start">
					<p class="font-bold">The 101 Bandung</p>
					<div class="flex">
						<Icon
							icon="material-symbols:star-rounded"
							width="24"
							height="24"
							style="color: #fae000"
						/>
						<Icon
							icon="material-symbols:star-rounded"
							width="24"
							height="24"
							style="color: #fae000"
						/>
						<Icon
							icon="material-symbols:star-rounded"
							width="24"
							height="24"
							style="color: #fae000"
						/>
						<Icon
							icon="material-symbols:star-rounded"
							width="24"
							height="24"
							style="color: #fae000"
						/>
					</div>
				</div>
				<div class="text-start">
					Jl. Ir. H. Juanda No. 3 , Dago,Bandung,Jawa Barat, Indonesia, 40115
				</div>
			</div>

			<div class="flex items-center justify-between rounded-lg bg-gray-300/40 px-2 py-5">
				<div class="flex flex-col items-center text-xs">
					<span class="font-semibold">Check-in</span>
					<span>Tue, 11 March 2025</span>
				</div>
				<div class="text-xs">
					<span>--1 night--</span>
				</div>
				<div class="flex flex-col items-center text-xs">
					<span class="font-semibold">Check-out</span>
					<span>Wed, 12 March 2025</span>
				</div>
			</div>

			<div class="space-y-2">
				<p class="font-bold">2 Delux Room, 3 Guest</p>
				<div class="flex flex-col px-5">
					<span>include Breakfast</span>
					<span>Doble Bed</span>
				</div>
			</div>
			<div class="space-y-2">
				<p class="font-bold">Cancellation Policy</p>
				<div class="flex gap-4">
					<Icon icon="jam:close" width="24" height="24" style="color: #c10303" />
					<span class="text-[#c10303]">Non-Refaunable</span>
					<TooltipInfo variant="red">
						{#snippet tooltipContent()}
							<p class="text-xs font-bold">This reservation is non-refundable.</p>
							<p class="text-xs">
								If you cancel this reservation, you will not get a refund or credit to use for a
								future stay.
							</p>
						{/snippet}
					</TooltipInfo>
				</div>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
