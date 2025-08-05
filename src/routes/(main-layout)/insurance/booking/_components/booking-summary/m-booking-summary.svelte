<script lang="ts">
	import { Share } from '$lib/components/icons';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Building, ChevronRight } from '@lucide/svelte';
</script>

<div class="space-y-4">
	<div class="flex items-center gap-2">
		<Building />
		<div class="font-semibold">RSP (Reka Sinergi Pratama)</div>
	</div>

	<Card.Root class="py-4">
		<Card.Content class="px-4">
			<div class="flex items-center justify-between">
				<div>
					<div class="flex items-center gap-4">
						<img
							class="size-10 object-contain object-center"
							src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/insurance/zurichpng.png"
							alt="brand-logo"
						/>
						<p class="text-lg font-semibold">Zurich Travel Insurance Basic</p>
					</div>

					<p class="text-xs">Singapore ∙ Family ∙ 18 May 2025 - 19 May 2025</p>
				</div>
				<ChevronRight />
			</div>
		</Card.Content>
	</Card.Root>

	<div class="space-y-1">
		<Label class="text-lg font-semibold">Promo Code</Label>
		<div class="flex items-center gap-2">
			<Input placeholder="Enter Promo Code" />
			<Button variant="outline" class="border-primary text-primary!">Apply</Button>
		</div>
	</div>
</div>
