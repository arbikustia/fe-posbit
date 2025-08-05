<script lang="ts">
	import { displayDate } from '$lib/helpers/date-helper';
	import type { DateTime } from '$lib/types/FlightResponse';
	import { cn } from '$lib/utils';
	import dayjs from 'dayjs';
	import type { Snippet } from 'svelte';

	type TimelineItemProps = {
		date: DateTime;
		children: Snippet;
		active?: boolean;
	};

	const { date, children, active = false }: TimelineItemProps = $props();
</script>

<div class="flex w-fit gap-x-4">
	<div
		class={cn('w-14 justify-end pb-5 text-end text-sm text-gray-400', {
			'mt-[-0.2rem]': !active,
			'mt-[0.2rem]': active
		})}
	>
		<div>{displayDate(date, 'HH:mm:ss')}</div>
		<div>{displayDate(date, 'DD MMM')}</div>
	</div>
	<div class="flex w-2 flex-col items-center gap-1 pb-1">
		<div
			class={cn('h-3 w-3 rounded-full bg-gray-400 outline-solid outline-2 outline-gray-400/40', {
				'bg-primary': active,
				'outline-primary/30': active,
				'mt-2': active
			})}
		></div>
		<div class="flex-1 border border-dashed border-gray-500"></div>
	</div>
	<div
		class={cn('flex-1 pb-5', {
			'mt-[-0.4rem]': !active
		})}
	>
		{@render children()}
	</div>
</div>
