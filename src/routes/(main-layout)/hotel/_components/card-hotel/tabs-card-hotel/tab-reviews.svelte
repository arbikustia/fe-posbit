<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import Icon from '@iconify/svelte';

	const reviews = [
		{
			name: 'AAA',
			date: '1 week ago',
			rating: 4,
			review:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
		},
		{
			name: 'AAA',
			date: '1 week ago',
			rating: 4,
			review:
				"Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s..."
		}
	];
</script>

<div class="space-y-5">
	<div class="mx-auto max-w-7xl px-4">
		<!-- Header -->
		<div class="mb-4 flex items-center space-x-4">
			<h2 class="text-xl font-bold text-gray-500">Review Rating</h2>
		</div>

		<!-- Grid Review Cards -->
		<div class="grid grid-cols-1 gap-2 md:grid-cols-1">
			{#each reviews as review}
				<Card.Root>
					<Card.Content>
						<div>
							<div class="mb-1 flex items-center justify-between">
								<h3 class="text-md font-bold">{review.name}</h3>
								<span class="text-sm text-gray-500">{review.date}</span>
							</div>

							<!-- Stars -->
							<div class="text-md mb-1 flex space-x-1 text-gray-500">
								{#each Array(5) as _, i}
									<span>
										{#if i < review.rating}
											<Icon icon="ic:round-star" width="20" height="20" style="color: #f4cc4a" />
										{/if}
									</span>
								{/each}
							</div>

							<!-- Content -->
							<p class="text-md text-justify leading-relaxed text-gray-700">
								{review.review}
							</p>
						</div>
					</Card.Content>
				</Card.Root>
			{/each}
		</div>
	</div>
</div>
