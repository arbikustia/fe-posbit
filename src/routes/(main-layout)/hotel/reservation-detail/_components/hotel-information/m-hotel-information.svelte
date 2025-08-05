<script>
	import Icon from '@iconify/svelte';

	export let hotelName = 'The 101 Bandung';
	export let stars = 4; // dari 5
	export let address = 'Jl. Ir. H. Juanda No. 3 , Dago, Bandung, Jawa Barat, Indonesia, 40115';
	export let checkIn = 'Tue, 11 March 2025';
	export let checkOut = 'Wed, 12 March 2025';
	export let nights = '1 Night';
	export let roomCategory = 'Deluxe';
	export let roomCount = 2;
	export let bedType = 'Double, Single';
	export let facility = 'Breakfast';

	const maxStars = 5;
</script>

<div class="w-full space-y-1 text-sm mt-16 px-3">
	<h2 class="text-md px-2 font-bold">Hotel Information</h2>

	<div class="space-y-3 px-3 border rounded-md bg-white p-4 shadow-lg">
		<div>
			<div class="font-bold">{hotelName}</div>
			<div class="mt-1 flex items-center space-x-1">
				{#each Array(maxStars) as _, i}
					{#if i < stars}
						<Icon icon="tabler:star-filled" width="16" height="16" style="color: #fdb900" />
					{:else}
						<Icon icon="tabler:star" width="16" height="16" style="color: #fdb900" />
					{/if}
				{/each}
			</div>
			<div class="mt-2 flex items-start  space-x-1">
				<Icon icon="basil:location-solid" width="18" height="18" style="color: #535353" />
				<span class="rounded px-1 text-sm">{address}</span>
			</div>
		</div>

		<div class="grid grid-cols-2 rounded bg-gray-100 p-2 text-center text-sm">
			<div>
				<div class="font-semibold">Check-in</div>
				<div>{checkIn}</div>
			</div>
			<div>
				<div class="font-semibold">Check-in</div>
				<div>{checkOut}</div>
			</div>
			<div class="col-span-2 my-1 text-center text-xs text-gray-500">
				---------- {nights} ----------
			</div>
		</div>

		<div class="grid grid-cols-2 gap-y-1 text-sm">
			<div class="font-semibold">Room Category</div>
			<div>{roomCategory}</div>
			<div class="font-semibold">Number of Room</div>
			<div>{roomCount}</div>
			<div class="font-semibold">Bed Type</div>
			<div>{bedType}</div>
			<div class="font-semibold">Facility</div>
			<div>{facility}</div>
		</div>
	</div>
</div>
