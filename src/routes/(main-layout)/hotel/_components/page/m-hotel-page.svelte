<script lang="ts">
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import * as Card from '$lib/components/ui/card';
	import { MPreviousStay } from '../previous-stay';
	import { MSearchHotelPanel } from '../search-hotel-panel';
</script>

<div class="relative">
	<div class="z-20 absolute">
		<MOSGAppBar>
			{#snippet leftContent()}
				<div class="text-lg font-semibold">Hotel</div>
			{/snippet}
		</MOSGAppBar>
	</div>
	<img
		class="absolute z-10"
		src="https://th.bing.com/th/id/R.9cf36642ce9c9bb553a0a27ba07bf58b?rik=pW4LhtvHa1RdQg&riu=http%3a%2f%2fwww.cfmedia.vfmleonardo.com%2fimageRepo%2f6%2f0%2f100%2f3%2f616%2fbkksi-exterior-0385-hor-clsc_O.jpg&ehk=HNwAlG3G6LCYLmfK4VGLxbRarmOrWWUGJ5uVqNIqJQE%3d&risl=&pid=ImgRaw&r=0"
		alt=""
	/>
	<div class="absolute z-20 mt-40 w-screen space-y-4 px-3">
		<Card.Root>
			<Card.Content class="">
				<MSearchHotelPanel />
			</Card.Content>
		</Card.Root>
		<div>
			<MPreviousStay />
		</div>
	</div>
</div>
