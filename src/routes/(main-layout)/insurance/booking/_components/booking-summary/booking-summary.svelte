<script lang="ts">
	import { Share } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Building } from '@lucide/svelte';
</script>

<Card.Root class="gap-4 py-4">
	<Card.Header class="flex items-center justify-between">
		<div class="flex items-center gap-2">
			<Building />
			<div class="font-semibold">RSP (Reka Sinergi Pratama)</div>
		</div>

		<Button variant="outline">
			<Share />
		</Button>
	</Card.Header>
	<Card.Content class="px-4">
		<Separator class="mb-4" />
		<div class="mb-2 flex items-center gap-4">
			<img
				class="size-20 object-contain object-center"
				src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/insurance/zurichpng.png"
				alt="brand-logo"
			/>
			<div>
				<p class="font-semibold">Zurich Travel Insurance Basic</p>
				<div>
					<div class="flex items-center gap-2">
						<Button variant="link" class="h-fit p-0 underline">Coverage</Button>
						<span>.</span>
						<Button variant="link" class="h-fit p-0 underline">Premium Charges</Button>
					</div>
					<Button variant="link" class="h-fit p-0 underline">Product Information</Button>
				</div>
			</div>
		</div>
		<div class="space-y-1">
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Type of Trip</p>
				<p class="font-medium">Short Trip</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Type of Plan</p>
				<p class="font-medium">Individual</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Age Coverage</p>
				<p class="font-medium">0-70 years</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Area Coverage</p>
				<p class="font-medium">Area A</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Destination</p>
				<p class="font-medium">Singapore</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Start Date</p>
				<p class="font-medium">Wed, 19 Mar 2025</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>End Date</p>
				<p class="font-medium">Wed, 19 Mar 2025</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Duration</p>
				<p class="font-medium">1 day(s)</p>
			</div>
			<div class="flex items-center justify-between text-sm text-gray-600">
				<p>Insured Person</p>
				<p class="font-medium">1 traveler(s)</p>
			</div>
		</div>
		<Separator class="my-4" />

		<div class="space-y-1">
			<Label class="text-base font-semibold">Promo Code</Label>
			<div class="flex items-center gap-2">
				<Input placeholder="Enter Promo Code" />
				<Button variant="outline" class="border-primary text-primary!">Apply</Button>
			</div>
		</div>
	</Card.Content>
</Card.Root>
