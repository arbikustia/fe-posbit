<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import Icon from '@iconify/svelte';
	import TooltipInfo from './_components/tooltip-info/tooltip-info.svelte';
</script>

<MOSGAppBar class="border-grey-300 flex h-16 items-start border bg-blue-500 text-white shadow-none">
	{#snippet leftContent()}
		<div class="flex w-[60vw] flex-col justify-start">
			<span class="text-lg font-bold">Booking Form</span>
		</div>
	{/snippet}
</MOSGAppBar>

<div class="mt-20 space-y-7 px-5 pb-44">
	<div class="flex w-full justify-center">
		<div class="h-36 w-[90%] rounded-md bg-gray-600"></div>
	</div>

	<div>
		<div class="flex w-full flex-col items-start justify-start">
			<p class="font-bold">The 101 Bandung</p>
			<div class="flex">
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
				<Icon icon="material-symbols:star-rounded" width="24" height="24" style="color: #fae000" />
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
						If you cancel this reservation, you will not get a refund or credit to use for a future
						stay.
					</p>
				{/snippet}
			</TooltipInfo>
		</div>
	</div>

	<div class="space-y-2">
		<p class="font-bold">Guest - OPSIGO</p>
		<div class="flex flex-col px-5">
			<span>Mr. Malcolm Arnov Jusuf</span>
			<span>Mr. Andre Frendra Zuli</span>
			<span>Mrs. Audrey</span>
		</div>
	</div>
	<div class="space-y-2">
		<p class="font-bold">Remarks For Hotel</p>
		<div class="flex flex-col px-5">
			<span>Bed Type: Signle</span>
		</div>
	</div>
	<div class="space-y-2">
		<p class="font-bold">Payment Detail</p>
		<div class="flex flex-col px-5">
			<div class="flex justify-between">
				<span>Night 1</span>
				<span>IDR 9.950.000</span>
			</div>
		</div>
		<div class="flex flex-col px-5">
			<div class="flex justify-between">
				<span>Taxes and fees</span>
				<span>IDR 50.000</span>
			</div>
		</div>
		<hr class="border border-gray-800" />
		<div class="flex flex-col px-5">
			<div class="flex justify-between font-bold">
				<span>Total Payment</span>
				<span>IDR 10.000.000</span>
			</div>
		</div>
	</div>
	<div
		class="fixed bottom-0 left-0 flex w-full flex-col items-center justify-center gap-2 border-t border-gray-500 bg-white p-4"
	>
		<p class="text-xs text-gray-500">
			By clicking this check box on the left, you have agreed to Opsigo's Terms & Conditions and
			Supplier's Terms and Conditions.
		</p>
		<button class="h-10 w-[50%] rounded-md bg-blue-700 text-white"> Reserve Hotel </button>
	</div>
</div>
