<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { TrainCardClass } from '../train-card-class';
	import MTrainCardClass from '../train-card-class/m-train-card-class.svelte';
	import { MTrainDetail } from '../train-detail';

	let isOpenDetailDialog = $state(false);
</script>

<div class="rounded-md bg-card p-2 shadow-sm">
	<div class="flex flex-1 gap-x-4">
		<div class="flex flex-1 items-center justify-end">
			<!-- TRAIN LOGO -->
			<div class="mr-auto flex items-center gap-3">
				<div>
					<div
						class="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-white shadow-sm"
					>
						<img
							class="h-[30px] w-[30px] object-contain"
							src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/kai.png"
							alt="logo"
						/>
					</div>
				</div>

				<div>
					<div class="text-sm font-semibold">ARGO PARAHYANGAN</div>
					<div class="text-xs">KA-137</div>
					<!-- DEPARTURE -> ARRIVAL -->
					<div class="mt-2 flex items-center gap-1">
						<!-- ORIGIN -->
						<div class="text-center text-xs leading-none">
							<div class="font-medium">06:10</div>
							<div class="text-muted-foreground">GMR</div>
						</div>

						<!-- DURATION -->
						<div class="flex w-[90px] items-center justify-center text-center">
							<div class="w-3 border border-b border-muted-foreground"></div>
							<div class="w-[60px] text-xs text-muted-foreground">
								<div class="whitespace-nowrap">4h 10m</div>
							</div>

							<div class="w-3 border border-b border-muted-foreground"></div>
						</div>

						<!-- DESTINATION -->
						<div class="text-center text-xs leading-none">
							<div class="font-medium">10:00</div>
							<div class="text-muted-foreground">BD</div>
						</div>
					</div>
				</div>
			</div>

			<!-- SELECT PRICE -->
			<div>
				<MTrainCardClass value="1" />
			</div>
		</div>
	</div>

	<Separator class="my-2" />

	<div class="flex items-center justify-between">
		<Button
			onclick={(e) => {
				isOpenDetailDialog = true;
			}}
			size="sm"
			class="h-fit p-0 hover:no-underline"
			variant="link"
		>
			View Detail
		</Button>
		<Button
			onclick={(e) => {
				e.stopPropagation();
			}}
			size="sm"
			class="h-fit py-1"
		>
			Select
		</Button>
	</div>
</div>

<MTrainDetail bind:isOpen={isOpenDetailDialog} />
