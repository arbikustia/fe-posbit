<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import { OSGBookingStatus, type BookingStatus } from '$lib/components/opsigo-ui/booking-status';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Separator } from '$lib/components/ui/separator';
	import { ExternalLink } from '@lucide/svelte';

	export type BookingType = 'flight' | 'hotel' | 'train' | 'insurance';
	type BookingItemProps = {
		type: BookingType;
		status: BookingStatus;
		providerName: string;
		providerImage?: string;
	};

	const { type, status, providerName, providerImage }: BookingItemProps = $props();
</script>

{#snippet icon(icon: string)}
	<Icon {icon} width="16" height="16" class="text-gray-500" />
{/snippet}

{#snippet flightInfo()}
	<div>
		<div class="flex items-center gap-x-2">
			{@render icon('ic:outline-route')}
			<p>CGK → SUB</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('stash:airplane-light')}
			<p>GA 123/GA 073/GA 072</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('mynaui:calendar')}
			<p>20 June 2025</p>
		</div>
	</div>
{/snippet}

{#snippet hotelInfo()}
	<div>
		<div class="flex items-center gap-x-2">
			{@render icon('lucide:map-pin')}
			<p>Berlin, Germany</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('material-symbols:door-open-outline-rounded')}
			<p>3 Rooms</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('mynaui:calendar')}
			<p>20 June 2025 <span class="text-muted-foreground text-sm italic">(3 nights)</span></p>
		</div>
	</div>
{/snippet}

{#snippet insuranceInfo()}
	<div>
		<div class="flex items-center gap-x-2">
			{@render icon('lucide:map-pin')}
			<p>Thailand</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('mi:document')}
			<p>Individual</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('mynaui:calendar')}
			<p>20 June 2025 <span class="text-muted-foreground text-sm italic">(1 day)</span></p>
		</div>
	</div>
{/snippet}

{#snippet trainInfo()}
	<div>
		<div class="flex items-center gap-x-2">
			{@render icon('ic:outline-route')}
			<p>GMR → BD</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('material-symbols:train-outline')}
			<p>KA-150GP</p>
		</div>
		<div class="flex items-center gap-x-2">
			{@render icon('mynaui:calendar')}
			<p>20 June 2025</p>
		</div>
	</div>
{/snippet}

{#snippet provider()}
	<Badge variant="secondary" class="mb-1 rounded-full bg-gray-200">
		<div class="flex w-auto items-center gap-x-3">
			{#if type === 'hotel'}
				<Icon icon="hugeicons:hotel-01" class="size-5 text-gray-500" />
			{:else}
				<Avatar.Root class="size-6">
					<Avatar.Image class="object-contain" src={providerImage} alt="provider-logo" />
				</Avatar.Root>
			{/if}

			<h3 class="font-semibold">{providerName}</h3>
		</div>
	</Badge>
{/snippet}

<div class="bg-card rounded-lg border p-4">
	<div class="flex items-center justify-between">
		{@render provider()}
		<OSGBookingStatus {status} class="rounded-full text-base" indicatorClass="size-4" />
	</div>

	<Separator class="my-2" />

	<div class="grid grid-cols-4 gap-x-4">
		{#if type === 'flight'}
			{@render flightInfo()}
		{:else if type === 'hotel'}
			{@render hotelInfo()}
		{:else if type === 'insurance'}
			{@render insuranceInfo()}
		{:else if type === 'train'}
			{@render trainInfo()}
		{/if}

		<div>
			<div class="mb-1 flex items-center gap-x-2">
				<div class="w-4">
					{@render icon('tabler:building')}
				</div>
				<p class="overflow-hidden text-ellipsis whitespace-nowrap">PT. Reka Sinergi Pratama</p>
			</div>
			<div class="flex gap-x-2">
				<div class="w-4">
					{@render icon('simple-line-icons:people')}
				</div>
				<div class="text-sm">
					<p class="overflow-hidden text-ellipsis whitespace-nowrap leading-none">3 Adults</p>
				</div>
			</div>
		</div>
		<div>
			<div class="flex items-center gap-x-2">
				<div class="w-4">
					{@render icon('bx:store')}
				</div>
				<p class="overflow-hidden text-ellipsis whitespace-nowrap">Agent Balikpapan</p>
			</div>
			<div class="pl-6 text-sm">
				<p>AdminXX</p>
				<p>2 Dec 2025, 10:30</p>
				<p class="text-muted-foreground italic">3 days ago</p>
			</div>
		</div>
		<div class="flex justify-between">
			<div class="flex flex-col items-start justify-center gap-y-1">
				<p class="text-primary">DJKSXA</p>
				<p class="text-lg font-bold">1,345,000 IDR</p>
			</div>
			<div class="flex items-center justify-center">
				<Button variant="ghost" class="p-0 hover:no-underline">
					<ExternalLink class="text-muted-foreground size-5" />
				</Button>
			</div>
		</div>
	</div>
</div>
