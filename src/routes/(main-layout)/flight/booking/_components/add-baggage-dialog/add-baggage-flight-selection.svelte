<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import { ChevronRight } from '@lucide/svelte';

	type AddBaggageFlightSelectionProps = {
		isSelected: boolean;
		tripIdx: number;
		isUnavailable?: boolean;
		onSelect: (tripIdx: number) => void;
		selectedBaggages: string;
		totalPrice: string;
	};

	let {
		isSelected,
		tripIdx,
		isUnavailable = false,
		onSelect,
		selectedBaggages,
		totalPrice
	}: AddBaggageFlightSelectionProps = $props();
</script>

<Button
	disabled={isUnavailable}
	variant="ghost"
	class={cn('relative block h-fit w-full rounded-none p-0 text-start font-normal', {
		'bg-primary/10!': isSelected
	})}
	onclick={() => onSelect(tripIdx)}
>
	<div class="px-4 py-2">
		<div class="mb-2 flex w-full items-center justify-between">
			<div class="flex items-center gap-3">
				<div
					class="flex h-7 w-7 items-center justify-center rounded-md bg-primary/70 text-center font-medium text-primary-foreground"
				>
					{tripIdx + 1}
				</div>

				<div>Thu, 2 Jan 25</div>
			</div>

			<div class="flex items-center gap-x-2">
				<img
					class="max-h-[40px] max-w-[100px]"
					src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/JT-mail.png"
					alt="logo"
				/>
				<ChevronRight class="h-5! w-5! text-gray-400" />
			</div>
		</div>

		<div class="w-full">
			<div class="flex items-center justify-center">
				<div class="flex items-center gap-1">
					<div class="w-[50px] text-center leading-none">
						<div class="text-lg font-medium">12:30</div>
						<div class="text-muted-foreground">CGK</div>
					</div>

					<div class="flex w-[100px] items-center justify-center gap-2 text-center">
						<div class="w-3 border-b border-dashed border-muted-foreground"></div>
						<div class="text-sm text-muted-foreground">
							<div class="whitespace-nowrap">3h 5m</div>
						</div>

						<div class="w-3 border-b border-dashed border-muted-foreground"></div>
					</div>

					<div class="w-[50px] text-center leading-none">
						<div class="text-lg font-medium">15:30</div>
						<div class="text-muted-foreground">SUB</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if isUnavailable}
		<div class="px-4 py-2">
			<div class="rounded-sm bg-gray-200 py-2 text-center">
				Baggage selection not available for this flight
			</div>
		</div>
	{:else}
		<div class="flex justify-between border-y bg-gray-100 px-4 py-2">
			<p>{selectedBaggages}</p>
			<p>{totalPrice}</p>
		</div>
	{/if}

	{#if isSelected}
		<span class="absolute bottom-0 left-0 top-0 w-1 rounded-r-md bg-primary"></span>
	{/if}
</Button>
