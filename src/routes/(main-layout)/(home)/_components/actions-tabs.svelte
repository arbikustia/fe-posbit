<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Icon from '@iconify/svelte';
	import UrgentAction from './urgent-action/urgent-action.svelte';
	import ActiveReservation from './active-reservation/active-reservation.svelte';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { cn } from '$lib/utils';
</script>

<div class="mx-auto w-full">
	<Tabs.Root value="urgent-action" class="w-full">
		<Tabs.List class="grid h-full w-full grid-cols-2 gap-1 rounded-lg bg-gray-100 p-1">
			<Tabs.Trigger
				value="urgent-action"
				class={cn(
					'data-[state=active]:shadow-xs data-[state=active]:text-primary flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900'
				)}
			>
				<Icon icon="material-symbols:warning-outline" class="h-5 w-5" />
				<span>Urgent Action</span>
				<span
					class="
        inline-flex h-5 min-w-[20px]
        items-center justify-center rounded-full
        bg-gray-500 px-1.5 text-xs font-medium text-white
        "
				>
					4
				</span>
			</Tabs.Trigger>

			<Tabs.Trigger
				value="active-reservation"
				class={cn(
					'data-[state=active]:shadow-xs data-[state=active]:text-primary flex items-center justify-center gap-2 rounded-md px-4 py-3 text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:bg-gray-100 data-[state=inactive]:hover:text-gray-900'
				)}
			>
				<Icon icon="material-symbols:check-circle-outline" class="h-4 w-4 " />
				<span class="font-medium">Active Reservation</span>
				<span
					class="
        inline-flex h-[25px] min-w-[20px]
        items-center justify-center rounded-full
        bg-red-500 px-1.5 text-xs font-medium text-white
        "
				>
					40
				</span>
			</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="urgent-action" class="mt-6">
			<!-- <UrgentAction /> -->
			<UrgentAction />
		</Tabs.Content>

		<Tabs.Content value="active-reservation" class="mt-6">
			<!-- <ActiveReservation /> -->
			<ActiveReservation />
		</Tabs.Content>
	</Tabs.Root>
</div>
