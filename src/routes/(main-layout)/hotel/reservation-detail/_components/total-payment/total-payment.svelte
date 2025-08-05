<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Icon from '@iconify/svelte';
</script>

<Drawer.Root>
	<Drawer.Trigger
		class="flex w-full fixed bottom-0 items-center justify-between gap-3 rounded-md border bg-white px-4 py-2 shadow-md"
	>
		<!-- Payment Info -->
		<div class="flex flex-col text-left">
			<span class="text-sm text-gray-500">Total Payment</span>
			<div class="flex items-center gap-1">
				<span class="text-lg font-bold text-black">1,234,000 IDR</span>
				<Icon icon="mdi:chevron-up" width="16" height="16" class="text-gray-500" />
			</div>
		</div>

		<!-- Action Buttons -->
		<div class="flex items-center gap-2">
			<!-- Dots Button -->
			<button class="h-8 w-8 rounded-md bg-gray-200 text-lg font-bold text-black">…</button>

			<!-- Issue Voucher -->
			<button
				class="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
			>
				Issue Voucher
			</button>
		</div>
	</Drawer.Trigger>

	<Drawer.Content class="w-full max-w-lg rounded-t-2xl  text-white">
		<!-- Drag handle -->
		<div class="flex justify-center py-2">
			<div class="h-1 w-12 rounded-full bg-gray-400"></div>
		</div>

		<div class="rounded-t-2xl bg-white p-6 text-black">
			<h2 class="mb-4 text-lg font-semibold">Payment Details</h2>

			<div class="space-y-2 text-sm">
				<div class="flex justify-between">
					<span>Net to Agent</span>
					<span>9,950,000 IDR</span>
				</div>
				<div class="flex justify-between">
					<span>Room Category - 1</span>
					<span>9,950,000 IDR</span>
				</div>
				<div class="flex justify-between">
					<span>Net to Agent</span>
					<span>9,950,000 IDR</span>
				</div>
				<div class="flex justify-between">
					<span>Value Added Tax (VAT)</span>
					<span>9,950,000 IDR</span>
				</div>
			</div>

			<hr class="my-4 border-gray-300" />

			<div class="flex justify-between text-base font-bold">
				<span>Total Payment</span>
				<span class="text-black">10,000,000 IDR</span>
			</div>
		</div>
	</Drawer.Content>
</Drawer.Root>
