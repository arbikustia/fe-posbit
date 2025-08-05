<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { ancillaryIconUrl } from '$lib/constants/app';

	let { onclick } = $props();
</script>

<Card.Root class="py-4">
	<Card.Content>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-x-4">
				<img class="h-10" src={ancillaryIconUrl.seat} alt="Flight Ancillary Icon" />
				<span class="text-lg font-semibold">Seat</span>
			</div>

			<Button variant="outline" class="text-primary hover:text-primary w-36" size="sm" {onclick}>
				Pick Seat
			</Button>
		</div>
	</Card.Content>
</Card.Root>
