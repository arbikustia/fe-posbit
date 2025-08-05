<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Table from '$lib/components/ui/table/index.js';
	import Icon from '@iconify/svelte';

	const hotels = [
		{
			id: 'HTL001',
			hotelName: 'Grand Plaza Hotel',
			star: 5,
			address: 'Jl. Thamrin No. 123, Jakarta Pusat',
			price: '120.000',
			rooms: [
				{
					roomType: 'Superior with 2 single beds',
					bedType: 'King Bed',
					breakfast: true,
					cancellationPolicy: 'Free before Mon, 23 Jun 2025',
					price: '340000',
					available: true
				},
				{
					roomType: 'Superior with 2 single beds',
					bedType: 'King Bed',
					breakfast: true,
					cancellationPolicy: 'Guaranteed Booking',
					price: '340000',
					available: true
				},
				{
					roomType: 'Deluxe Room',
					bedType: 'Queen Bed',
					breakfast: true,
					cancellationPolicy: 'Free before Tue, 24 Jun 2025',
					price: '450000',
					available: true
				}
			]
		},
		{
			id: 'HTL002',
			hotelName: 'Luxury Resort & Spa',
			star: 4,
			address: 'Jl. Sunset Beach, Bali',
			price: '85.000',
			rooms: [
				{
					roomType: 'Ocean View Suite',
					bedType: 'King Bed',
					breakfast: true,
					cancellationPolicy: 'Free before Wed, 25 Jun 2025',
					price: '275000',
					available: true
				},
				{
					roomType: 'Garden Villa',
					bedType: 'Twin Beds',
					breakfast: true,
					cancellationPolicy: 'Non-refundable',
					price: '320000',
					available: false
				}
			]
		},
		{
			id: 'HTL003',
			hotelName: 'Business Center Hotel',
			star: 3,
			address: 'Jl. Sudirman No. 456, Jakarta Selatan',
			price: '65.000',
			rooms: [
				{
					roomType: 'Standard Room',
					bedType: 'Queen Bed',
					breakfast: true,
					cancellationPolicy: 'Free before Thu, 26 Jun 2025',
					price: '185000',
					available: true
				},
				{
					roomType: 'Executive Room',
					bedType: 'King Bed',
					breakfast: true,
					cancellationPolicy: 'Guaranteed Booking',
					price: '225000',
					available: true
				}
			]
		},
		{
			id: 'HTL004',
			hotelName: 'Mountain View Lodge',
			star: 4,
			address: 'Jl. Raya Puncak, Bogor',
			price: '75.000',
			rooms: [
				{
					roomType: 'Mountain Suite',
					bedType: 'King Bed',
					breakfast: true,
					cancellationPolicy: 'Free before Fri, 27 Jun 2025',
					price: '295000',
					available: true
				}
			]
		},
		{
			id: 'HTL005',
			hotelName: 'City Center Inn',
			star: 2,
			address: 'Jl. Malioboro No. 789, Yogyakarta',
			price: '45.000',
			rooms: [
				{
					roomType: 'Economy Room',
					bedType: 'Single Bed',
					breakfast: true,
					cancellationPolicy: 'Free before Sat, 28 Jun 2025',
					price: '125000',
					available: true
				},
				{
					roomType: 'Standard Room',
					bedType: 'Double Bed',
					breakfast: true,
					cancellationPolicy: 'Guaranteed Booking',
					price: '165000',
					available: true
				}
			]
		}
	];

	// State untuk mengtrack row mana yang sedang expanded
	let expandedRows = new Set();

	function toggleRow(hotelId: string) {
		if (expandedRows.has(hotelId)) {
			expandedRows.delete(hotelId);
		} else {
			expandedRows.add(hotelId);
		}
		expandedRows = new Set(expandedRows); // Trigger reactivity
	}

	function renderStars(count: number) {
		return '★'.repeat(count) + '☆'.repeat(5 - count);
	}

	function formatPrice(price: string) {
		return new Intl.NumberFormat('id-ID').format(parseInt(price));
	}
</script>

<div class="w-full overflow-x-auto">
	<Table.Root class="">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[50px] font-medium">No</Table.Head>
				<Table.Head class="w-[100px] font-medium">Hotel Name</Table.Head>
				<Table.Head class="w-[60px] font-medium">Star</Table.Head>
				<Table.Head class="w-[100px] font-medium">Address</Table.Head>
				<Table.Head class="w-[100px] font-medium">Price</Table.Head>
				<Table.Head class="w-[120px] text-right font-medium"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each hotels as hotel, index (hotel.id)}
				<!-- Main hotel row -->
				<Table.Row
					class="cursor-pointer border-b transition-colors hover:bg-gray-50"
					onclick={() => toggleRow(hotel.id)}
				>
					<Table.Cell class="w-[50px] font-medium">{index + 1}</Table.Cell>
					<Table.Cell class="w-[100px] font-medium text-gray-900">{hotel.hotelName}</Table.Cell>
					<Table.Cell class="w-[60px]">
						<span class="flex items-center gap-1 font-medium">
							{hotel.star}<Icon
								icon="iconoir:star-solid"
								width="16"
								height="16"
								style="color: #eca813"
							/>
						</span>
					</Table.Cell>
					<!-- <Table.Cell class="min-w-[200px] text-gray-600"></Table.Cell> -->
					<Table.Cell class="w-[100px] text-gray-600">
						<div class="overflow-hidden text-ellipsis whitespace-normal break-words truncate line-clamp-2">
							{hotel.address}
						</div>
					</Table.Cell>
					<Table.Cell class="w-[100px] font-medium text-blue-600">IDR {hotel.price}</Table.Cell>
					<Table.Cell class="w-[120px] text-right font-medium text-blue-600">
						<Button
							variant="default"
							class="flex items-center justify-center whitespace-nowrap"
							onclick={(e) => {
								toggleRow(hotel.id), e.stopPropagation();
							}}
						>
							<span>Show ({hotel.rooms.length})</span>
							<div
								class="flex items-center justify-center gap-2 transition-transform duration-200 {expandedRows.has(
									hotel.id
								)
									? 'rotate-90'
									: ''}"
							>
								<Icon
									icon="material-symbols:arrow-forward-ios-rounded"
									width="16"
									height="16"
									style="color: #fff"
								/>
							</div>
						</Button>
					</Table.Cell>
				</Table.Row>

				<!-- Collapsible room details -->
				{#if expandedRows.has(hotel.id)}
					<Table.Row class="bg-neutral-50">
						<Table.Cell colspan={7} class="p-0">
							<div class="animate-in slide-in-from-top-2 w-full py-1 duration-200">
								<!-- Room details table - using standard HTML table -->
								<div class="mb-3 w-full overflow-x-auto">
									<table class="min-w-full border-collapse">
										<thead>
											<tr class="bg-gray-100 text-left text-sm font-medium text-gray-700">
												<th class="min-w-[200px] px-4 py-2">Room Type</th>
												<th class="w-[60px] px-4 py-2">
													<Icon
														icon="game-icons:meal"
														width="18"
														height="18"
														style="color: #6f6f6f"
													/>
												</th>
												<th class="w-[120px] px-4 py-2">Bed Type</th>
												<th class="min-w-[200px] px-4 py-2">Cancellation Policy</th>
												<th class="w-[120px] px-4 py-2">Price</th>
												<th class="w-[120px] px-4 py-2">Action</th>
											</tr>
										</thead>
										<tbody>
											{#each hotel.rooms as room}
												<tr class="border-b last:border-b-0 hover:bg-gray-50">
													<td
														class="min-w-[200px] max-w-[200px] break-words px-4 py-3 text-sm text-gray-900"
													>
														{room.roomType}
													</td>
													<td class="px-4 py-3 text-center">
														{#if room.breakfast}
															<Icon
																icon="ic:baseline-check"
																width="20"
																height="20"
																style="color: #4ab300"
															/>
														{:else}
															<Icon
																icon="ic:baseline-close"
																width="20"
																height="20"
																style="color: #d91000"
															/>
														{/if}
													</td>
													<td class="break-words px-4 py-3 text-sm text-gray-700">
														{room.bedType}
													</td>
													<td class="min-w-[200px] max-w-[200px] break-words px-4 py-3 text-sm">
														{#if room.cancellationPolicy.includes('Free')}
															<span class="text-green-600">{room.cancellationPolicy}</span>
														{:else if room.cancellationPolicy.includes('Guaranteed')}
															<span class="text-blue-600">{room.cancellationPolicy}</span>
														{:else}
															<span class="text-red-600">{room.cancellationPolicy}</span>
														{/if}
													</td>
													<td class="px-4 py-3 text-sm font-medium text-gray-900">
														IDR {formatPrice(room.price)}
													</td>
													<td class="px-4 py-3">
														{#if room.available}
															<Button variant="default" class="w-full rounded px-2 py-1 text-sm">
																Select
															</Button>
														{:else}
															<span class="rounded bg-gray-300 px-2 py-1 text-sm text-gray-500">
																Unavailable
															</span>
														{/if}
													</td>
												</tr>
											{/each}
										</tbody>
									</table>
								</div>
							</div>
						</Table.Cell>
					</Table.Row>
				{/if}
			{/each}
		</Table.Body>
	</Table.Root>
</div>
