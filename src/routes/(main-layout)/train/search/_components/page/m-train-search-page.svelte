<script>
	import { Share } from '$lib/components/icons';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import * as ToggleGroup from '$lib/components/ui/toggle-group';
	import { TripRouteInfo } from '../../../_components/trip-route-info';
	import { MFilterAll } from '../filter-all';
	import { MTrainSort } from '../train-sort';
	import { MFilterPrice } from '../filter-price';
	import { MDateSelector } from '../date-selector';
	import { MTrainCard } from '../train-card';
	import * as Drawer from '$lib/components/ui/drawer';
	import { MSearchForm } from '../../../_components/search-form';
	import { MShareSchedule } from '../share-schedule';

	let isOpenSearchPanel = $state(false);
</script>

<MOSGAppBar>
	{#snippet leftContent()}
		<div class="space-y-1">
			<div class="flex items-center gap-1 font-semibold">
				<TripRouteInfo
					class="text-xs"
					origin="Gambir"
					destination="Bandung"
					originCode="GMR"
					destinationCode="BD"
				/>
			</div>
			<div class="item-center flex">
				<p class="line-clamp-2 text-[0.63rem] text-gray-500">KAI ∙ 18 May 2025 ∙ 3 Pax</p>
			</div>
		</div>
	{/snippet}
	{#snippet rightContent()}
		<div class="text-primary flex items-center gap-2">
			<Button
				class="border-primary h-fit py-1 text-xs"
				variant="outline"
				size="sm"
				onclick={() => (isOpenSearchPanel = true)}>Change</Button
			>
			<MShareSchedule />
		</div>
	{/snippet}
</MOSGAppBar>

<div class="pt-14">
	<div class="sticky top-16 z-10 w-full">
		<div class="flex items-center bg-white py-1 pl-4">
			<div class="flex items-center gap-2 border-r pr-2">
				<MFilterAll />
				<MTrainSort />
			</div>
			<div class="scrollbar-hide flex items-center gap-2 overflow-x-auto py-2 pl-2">
				<MFilterPrice />
				<ToggleGroup.Root
					variant="outline"
					type="single"
					class="eq-toggle-root gap-2 pr-2"
					loop={false}
				>
					<ToggleGroup.Item
						value="morning"
						class="eq-toggle-item rounded-md! data-[state=on]:before:rounded-md! flex-none text-nowrap"
					>
						Morning to Noon Schedule
					</ToggleGroup.Item>
					<ToggleGroup.Item
						value="executive"
						class="eq-toggle-item rounded-md! border-l! data-[state=on]:before:rounded-md! flex-none text-nowrap"
						>Executive Class</ToggleGroup.Item
					>
				</ToggleGroup.Root>
			</div>
		</div>
		<div class="bg-neutral-50">
			<MDateSelector />
		</div>
	</div>

	<div class="space-y-2 p-4 pt-8">
		{#each Array(10)}
			<MTrainCard />
		{/each}
	</div>
</div>

<MSearchForm bind:isOpen={isOpenSearchPanel} variant="drawer" />
