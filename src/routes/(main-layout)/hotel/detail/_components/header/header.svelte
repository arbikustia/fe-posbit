<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import About from './about.svelte';
	import DetailRoomList from './detail-room-list.svelte';

	let tabItems = [
		{ value: 'about', label: 'About' },
		{ value: 'rooms', label: 'Rooms' },
		{ value: 'location', label: 'Location' },
		{ value: 'facilities', label: 'Facilities' },
		{ value: 'policies', label: 'Policies' },
		{ value: 'reviews', label: 'Reviews' }
	];
</script>

<Tabs.Root value="about" class="w-full border-b space-y-5">
	<!-- Tabs Header -->
	<Tabs.List class="flex w-full justify-start rounded-none border-b bg-gray-50 py-6">
		{#each tabItems as tab}
			<Tabs.Trigger
				value={tab.value}
				class="relative px-4 py-2  text-sm font-medium text-gray-700 hover:text-blue-600 data-[state=active]:text-blue-600"
			>
				{tab.label}
			</Tabs.Trigger>
		{/each}
	</Tabs.List>

	{#each tabItems as tab}
		<Tabs.Content value={tab.value} class="mt-4">
			<Card.Root>
				<Card.Content>
					{#if tab.value === 'about'}
						<About/>
					{/if}
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	{/each}

</Tabs.Root>
