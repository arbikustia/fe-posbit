<script lang="ts">
	import Icon from '@iconify/svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	let rooms = [
		{
			section: '',
			items: [
				{
					type: 'Superior Room',
					breakfast: true,
					isTwinBed: true,
					refundable: false,
					price: 560000,
					roomSize: 20.0,
					guaranteed: true
				},
				{
					type: 'Deluxe Room',
					breakfast: false,
					isTwinBed: true,
					refundable: true,
					price: 623000,
					roomSize: 20.0,
					guaranteed: false
				}
			]
		}
	];
</script>

{#each rooms as room}
	<div
		class={`mt-2 flex w-full flex-col gap-1 ${room.section !== '' ? 'border border-gray-400 p-2' : ''} rounded-md  `}
	>
		{#if room.section !== ''}
			<h3 class="mb-3 px-2 font-semibold text-blue-800">
				<span class="rounded-md bg-gray-100 px-3 py-1">
					{room.section}
				</span>
			</h3>
		{/if}
		{#each room.items as item}
			<div
				class={`flex w-full items-center justify-between px-5 ${room.section !== '' ? 'border' : 'border'} rounded-md border-gray-400 py-3`}
			>
				<div class="flex w-[40%] flex-col justify-start gap-3  px-2 text-start">
					<div class="text-[12px] font-bold">{item.type}</div>
					{#if item.guaranteed == true}
						<div class="flex items-center gap-2 text-xs">
							<Icon icon="vaadin:coin-piles" width="12" height="12" style="color: #8a8a8a" />
							<span class="text-[10px]"> Guaranteed Booking </span>
						</div>
					{/if}
					<div class={item.refundable ? 'text-xs text-green-600' : 'text-xs text-red-600'}>
						{#if item.refundable}
							<div class="flex items-center">
								<Icon icon="ic:outline-check" width="16" height="16" style="color: #00e612" />
								<span class="text-[10px]">Free Cancellation</span>
							</div>
						{:else}
							<div class="flex items-center">
								<Icon
									icon="material-symbols:close-rounded"
									width="16"
									height="16"
									style="color: #e60200"
								/>
								<span class="text-[10px]">Non-Refundable</span>
							</div>
						{/if}
					</div>
				</div>
				<div class="flex w-[30%] flex-col justify-between gap-1 text-start text-xs">
					{#if item.breakfast}
						<div class="flex items-center gap-2">
							<Icon
								icon="mdi:free-breakfast-outline"
								width="12"
								height="12"
								style="color: #8a8a8a"
							/>
							<span class="text-xs">Breakfast</span>
						</div>
					{:else}
						<div class="flex items-center gap-2">
							<Icon
								icon="mdi:free-breakfast-off-outline"
								width="12"
								height="12"
								style="color: #8a8a8a"
							/>
							<span class="text-xs">No Breakfast</span>
						</div>
					{/if}
					{#if item.isTwinBed}
						<div class="flex items-center gap-1">
							<Icon
								icon="material-symbols-light:bed"
								width="16"
								height="16"
								style="color: #8a8a8a"
							/>
							<span class="text-xs">Twind Bed</span>
						</div>
					{:else}
						<div class="flex items-center gap-2">
							<Icon
								icon="material-symbols-light:bed"
								width="12"
								height="12"
								style="color: #8a8a8a"
							/>
							<span class="text-xs">Twind Bed</span>
						</div>
					{/if}
					{#if item.roomSize}
						<div class="flex items-center gap-2">
							<Icon icon="mdi:ruler" width="12" height="12" style="color: #8a8a8a" />
							<span class="text-xs">20.0 m2</span>
						</div>
					{/if}
				</div>
				<div class="flex w-[30%] flex-col text-end">
					<div class="text-xs"><span class="rounded-md mb-1 bg-gray-200 px-2">TBO</span></div>
					<div class="text-xs">Total Price</div>
					<div class="text-sm font-bold text-red-600">IDR {item.price.toLocaleString()}</div>
					<div class="text-[10px]">(includes taxes & fees)</div>
					<Button onclick={() => goto('/hotel/booking')} class="text-xs h-8">Select Room</Button>
				</div>
			</div>
		{/each}
	</div>
{/each}
