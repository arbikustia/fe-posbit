<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { cn } from '$lib/utils';
	import { bookingStatusColor } from './constants';

	export type BookingStatus = 'reserved' | 'ticketed' | 'expired' | 'canceled' | 'error';

	const {
		status,
		statusText,
		class: className,
		indicatorClass
	}: {
		status: BookingStatus;
		statusText?: string;
		class?: string;
		indicatorClass?: string;
	} = $props();
</script>

<Badge
	class={cn('shadow-xs border capitalize', className)}
	style="border-color: {bookingStatusColor[status]};"
	variant="outline"
>
	<span
		class={cn('mr-2 h-[10px] w-[10px] rounded-full', indicatorClass)}
		style="background-color: {bookingStatusColor[status]};"
	></span>
	{statusText ?? status}</Badge
>
