<script>
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

<h1 class="mt-5 text-lg font-bold">Histories</h1>
<div class="space-y-6 rounded-lg border border-gray-200 bg-white p-4 shadow-md">
	<!-- Vertical Actions Section with Dashed Steps -->
	<div class="space-y-1">
		{#each actions as action, i}
			<div class="relative flex h-16">
				<!-- Vertical dashed line -->
				<div class="flex gap-3">
					<div class="">
						<div class="text-xs text-gray-800">{action.time}</div>
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
