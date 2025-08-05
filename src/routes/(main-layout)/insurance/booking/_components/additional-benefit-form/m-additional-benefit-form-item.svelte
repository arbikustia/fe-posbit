<script lang="ts">
	import { AccordionContent } from '$lib/components/ui/accordion';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ArrowLeft, ChevronDown, ChevronRight } from '@lucide/svelte';
	import { Accordion } from 'bits-ui';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Table from '$lib/components/ui/table';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';

	let open = $state(false);
</script>

<Card.Root class="py-4">
	<Card.Content class="px-2">
		<div class="flex items-center justify-between">
			<Form.Control>
				{#snippet children({ props })}
					<div class="flex w-full items-center justify-between gap-4 pr-4">
						<div class="flex items-center gap-2">
							<Checkbox {...props} />
							<div>
								<p class="font-semibold">Covid Protection</p>
								<p class="text-muted-foreground text-xs">Protect from Covid-19 up to 350,000 IDR</p>
							</div>
						</div>
						<p class="whitespace-nowrap text-sm font-semibold">50,000 IDR</p>
					</div>
				{/snippet}
			</Form.Control>
			<ChevronRight onclick={() => (open = true)} />
		</div>
	</Card.Content>
</Card.Root>

<Drawer.Root bind:open>
	<Drawer.Content
		class="border-none p-0"
		fullscreen={true}
		showDragHandle={false}
		data-vaul-no-drag
	>
		<MOSGAppBar class="bg-primary/85 text-primary-foreground static max-w-full">
			{#snippet leftAction()}
				<button
					onclick={() => {
						open = false;
					}}
				>
					<ArrowLeft />
				</button>
			{/snippet}

			{#snippet leftContent()}
				<div class="font-semibold">Covid Protection</div>
			{/snippet}
		</MOSGAppBar>

		<div>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Coverage</Table.Head>
						<Table.Head>Benefit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="whitespace-normal">
							<p>Daily Hospital Cash due to Covid-19</p>
							<p class="text-muted-foreground">Harian Rawat Inap karena Covid-19</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal">
							<p>
								Benefit: Rp 1.000.000 per day <br />Maximum up to Rp 14.000.000, Rp 1.000.000 per
								hari
							</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="whitespace-normal">
							<p>Trip Cancellation & Alteration</p>
							<p class="text-muted-foreground">Pembatalan & Perubahan Perjalanan</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal">
							<p>Rp 25.000.000</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="whitespace-normal">
							<p>
								Medical Expenses including Emergency Medical Evacuation (sublimit from Medical
								Expenses Benefits)
							</p>
							<p class="text-muted-foreground">
								Biaya Medis termasuk Evakuasi Medis Darurat (sublimit dari Manfaat Biaya Medis)
							</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal">
							<p>Rp 700.000.000</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="whitespace-normal">
							<p>Quarantine or Isolation Cost and Extra Transportation Cost</p>
							<p class="text-muted-foreground">
								Biaya Karantina atau Isolasi dan Biaya Transportasi Tambahan
							</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal">
							<ul class="list-inside list-disc">
								<li>Rp 1.000.000 per day, Maximum up to Rp 7.000.000</li>
								<li>
									Maximum Quarantine Limit with Transportation Cost is Rp 10.000.000  → Rp 1.000.000
									per hari (Maksimal sampai dengan Rp 7.000.000)
								</li>
							</ul>
						</Table.Cell>
					</Table.Row>
				</Table.Body>
			</Table.Root>
		</div>
	</Drawer.Content>
</Drawer.Root>
