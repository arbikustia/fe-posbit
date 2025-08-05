<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Icon from '@iconify/svelte';

	const actions = [
		{
			name: 'Sync PNR',
			user: 'John Doe',
			company: 'PT. Reka Sinergi Pratama',
			icon: 'mdi:sync',
			time: '17:34:05',
			date: '8 Feb',
			relative: '2 hours ago'
		},
		{
			name: 'Post Invoice',
			user: 'John Doe',
			company: 'PT. Reka Sinergi Pratama',
			icon: 'mdi:file-document-outline',
			time: '17:34:05',
			date: '8 Feb',
			relative: '2 hours ago'
		},
		{
			name: 'Book',
			user: 'John Doe',
			company: 'PT. Reka Sinergi Pratama',
			icon: 'mdi:bookmark-outline',
			time: '17:34:05',
			date: '8 Feb',
			relative: '2 hours ago'
		},
		{
			name: 'Create',
			user: 'John Doe',
			company: 'PT. Reka Sinergi Pratama',
			icon: 'mdi:plus-circle-outline',
			time: '17:34:05',
			date: '8 Feb',
			relative: '2 hours ago'
		}
	];
</script>

<Drawer.Root>
	<Drawer.Trigger class="flex w-full items-center gap-2  rounded-lg px-1 py-2  ">
		<!-- <Calendar class="w-4 h-4" /> -->
		<span
			class="flex h-12 w-full items-center justify-between rounded-md border bg-white px-3 text-start shadow-md"
		>
			<span class="flex gap-5 items-center">
				<Icon icon="solar:history-bold" width="18" height="18" style="color: #535353" />
				<span>Histories</span>
			</span>
			<Icon icon="weui:arrow-outlined" width="12" height="24" style="color: #535353" />
		</span>
	</Drawer.Trigger>

	<Drawer.Content class="w-full max-w-lg">
		<Drawer.Header class="border-b pb-4">
			<div class="flex items-center gap-2">
				<Icon icon="solar:history-bold" width="24" height="24" style="color: #535353" />
				<div>
					<Drawer.Title class="text-2xl font-bold text-gray-800">Histories</Drawer.Title>
				</div>
			</div>
		</Drawer.Header>

		<div class="max-h-[80vh] overflow-auto">
			<div class="space-y-1 px-5 pt-10">
				{#each actions as action, i}
					<div class="relative flex h-16">
						<!-- Vertical dashed line -->
						<div class="flex gap-3">
							<div class="">
								<div class="text-sm text-gray-800">{action.time}</div>
								<div class="text-xs text-gray-500">{action.date}</div>
								<div class="text-xs text-gray-400">{action.relative}</div>
							</div>
							<div class=" left-5 top-2 h-full w-px border-l-2 border-dashed border-gray-300"></div>
						</div>

						<ul class="">
							<li class="relative">
								<!-- Step dot -->
								<div
									class="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-white bg-gray-500"
								></div>

								<div class="flex items-start gap-3 px-5">
									<div>
										<h3 class="text-sm font-medium text-gray-800">{action.name}</h3>
										<p class="text-xs text-gray-500">{action.user} • {action.company}</p>
									</div>
								</div>
							</li>
						</ul>
					</div>
				{/each}
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
