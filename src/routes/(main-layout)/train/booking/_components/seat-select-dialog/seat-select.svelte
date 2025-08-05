<script lang="ts">
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { toast } from 'svelte-sonner';
	import * as Tooltip from '$lib/components/ui/tooltip';

	type Seat = {
		id: string;
		row: number;
		col: string;
		status: 'available' | 'unavailable' | 'selected';
	};

	const seatColors: Record<Seat['status'], string> = {
		available: 'bg-blue-900',
		selected: 'bg-green-500',
		unavailable: 'bg-gray-300'
	};

	const seatDetails: Record<Seat['status'], string> = {
		available: 'Available',
		selected: 'Selected',
		unavailable: 'Unavailable'
	};

	const columns = ['A', 'B', 'C', '', 'D', 'E', 'F'];
	const rows = Array.from({ length: 30 }, (_, i) => i + 1);

	let seats = $state<Seat[]>([]);

	function initializeSeats() {
		const newSeats: Seat[] = [];
		rows.forEach((row) => {
			columns.forEach((col) => {
				if (col === '') return;
				let status: Seat['status'] = 'available';
				if (Math.random() > 0.8) status = 'unavailable';

				newSeats.push({ id: row + col, row, col, status });
			});
		});
		seats = newSeats;
	}

	function toggleSeat(seat: Seat) {
		toast.success(`Selected Seat: ${seat.id}`);
	}

	initializeSeats();
</script>

<div class="relative flex w-full flex-col items-center p-4">
	<div class="sticky top-0 flex w-full items-center justify-center bg-gray-200">
		<div class="grid w-fit grid-cols-8 gap-x-2">
			<div></div>
			<div class="col-span-7 grid grid-cols-7 gap-2 text-center">
				{#each columns as col}
					{#if col !== ''}
						<div class="h-8 w-8 font-bold">{col}</div>
					{/if}
					{#if col === ''}
						<div class="w-4"></div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	<div class="grid grid-cols-8 gap-x-2 text-center">
		{#each rows as row, rowIdx}
			<div class="flex items-center justify-center font-bold">{row}</div>
			<div
				class={cn('col-span-7 bg-white px-4 pb-1 pt-4', {
					'pb-4': rows.length - 1 === rowIdx,
					'mt-[-4px]': rowIdx > 0
				})}
			>
				<div class="grid grid-cols-7 gap-2 text-center">
					{#each columns as col}
						{#if col === ''}
							<div class="w-4"></div>
						{:else}
							{#each seats.filter((s) => s.row === row && s.col === col) as seat}
								<Tooltip.Provider>
									<Tooltip.Root>
										<Tooltip.Trigger
											class={cn(
												'flex h-8 w-8 items-center justify-center rounded-lg font-bold text-white',
												seatColors[seat.status],
												{
													'cursor-not-allowed bg-gray-300': seat.status === 'unavailable'
												}
											)}
											disabled={seat.status === 'unavailable'}
											onclick={() => toggleSeat(seat)}
											>{#if seat.status === 'unavailable'}
												<Icon icon="ic:baseline-clear" />
											{/if}</Tooltip.Trigger
										>
										<Tooltip.Content class="space-y-1 bg-white font-semibold text-black">
											<p>{seat.id}</p>
											{seatDetails[seat.status]}
										</Tooltip.Content>
									</Tooltip.Root>
								</Tooltip.Provider>
							{/each}
						{/if}
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>
