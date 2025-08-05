<script lang="ts">
	import TabRoom from "../../../_components/card-hotel/tabs-card-hotel/tab-room.svelte";

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
                    guaranteed:false
				}
			]
		}
	];
</script>

<section class="w-full flex flex-col items-center">
	<h1 class="text-3xl font-bold text-gray-500">Select Room</h1>
	<span class="text-sm">2 Room Type Available</span>
	<TabRoom {rooms} />
</section>
