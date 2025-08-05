<script lang="ts">
	import { ImageGallery } from "../../../detail/_components/image-gallery";

	const imageList = [
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain',
		'https://th.bing.com/th/id/OIP.nPNmQs6cm7VToKJ7oHv1iwHaE8?rs=1&pid=ImgDetMain'
	];
</script>

<h3 class="mb-3 font-semibold text-blue-800">Gallery</h3>

<div class="grid w-full grid-cols-6 gap-1">
	{#if imageList.length > 0}
		<img src={imageList[0]} alt="" class="col-span-2 h-full w-full rounded object-cover" />
	{/if}

	<div class="col-span-4 flex w-full flex-col gap-1">
		<div class="grid grid-cols-4 gap-1" role="group" aria-label="Hotel gallery thumbnails">
			{#each imageList.slice(1, 5) as img}
				<img src={img} alt="" class="h-24 w-full rounded object-cover" />
			{/each}
		</div>

		<div class="grid grid-cols-4 gap-1">
			{#each imageList.slice(5, 6) as img}
				<img src={img} alt="" class="h-24 w-full rounded object-cover" />
				<ImageGallery />
			{/each}
		</div>
	</div>
</div>
