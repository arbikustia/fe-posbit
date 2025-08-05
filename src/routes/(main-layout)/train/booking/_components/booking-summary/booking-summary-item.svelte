<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';
</script>

<Card.Root class={cn('overflow-hidden')}>
	<Card.Content class="relative px-4 py-2">
		<div class="space-y-4">
			<div>
				<div class="flex items-center gap-x-6">
					<img
						class="h-8 w-8 object-contain object-center"
						src="https://portalvhds11000v9mfhk0k.blob.core.windows.net/airline/kai.png"
						alt="Logo"
					/>
					<div>
						<p class="text-sm font-semibold">ARGO PARAHYANGAN</p>
						<p class="text-xs text-gray-500">KA-137 Economy (A)</p>
					</div>
				</div>
			</div>
			<div class="flex flex-wrap justify-between gap-4">
				<!-- DEPARTURE -> ARRIVAL -->
				<div class="flex flex-1 items-center gap-3">
					<!-- ORIGIN -->
					<div class="w-28 text-center leading-none">
						<div class="text-lg font-medium">06:10</div>
						<div class="text-sm text-muted-foreground">
							<p>Gambir (GMR)</p>
							<p>Jakarta</p>
						</div>
					</div>

					<!-- DURATION -->
					<div class="flex flex-1 items-center justify-center gap-x-2 text-center">
						<div class="w-full border border-b border-gray-300"></div>
						<div class="text-xs">
							<div class="whitespace-nowrap text-muted-foreground">4h 10m</div>
						</div>

						<div class="w-full border border-b border-gray-300"></div>
					</div>

					<!-- DESTINATION -->
					<div class="w-28 text-center leading-none">
						<div class="text-lg font-medium">10:00</div>
						<div class="text-sm text-muted-foreground">
							<p>Bandung (BDG)</p>
							<p>Bandung</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</Card.Content>
</Card.Root>
