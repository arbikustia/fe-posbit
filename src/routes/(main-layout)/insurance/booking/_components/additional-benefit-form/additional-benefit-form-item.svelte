<script lang="ts">
	import { AccordionContent } from '$lib/components/ui/accordion';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { ChevronDown } from '@lucide/svelte';
	import { Accordion } from 'bits-ui';
	import * as Form from '$lib/components/ui/form';
	import * as Table from '$lib/components/ui/table';
</script>

<Accordion.Item class="rounded-md border p-2">
	<Accordion.Header class="flex items-center justify-between ">
		<Form.Control>
			{#snippet children({ props })}
				<div class="flex w-full items-center justify-between pr-4">
					<div class="flex items-center gap-2">
						<Checkbox {...props} />
						<div>
							<p class="text-lg font-semibold">Covid Protection</p>
							<p class="text-muted-foreground">Protect from Covid-19 up to 350,000 IDR</p>
						</div>
					</div>

					<p class="text-xl font-semibold">50,000 IDR</p>
				</div>
			{/snippet}
		</Form.Control>
		<Accordion.Trigger
			class="select-none text-[15px] font-medium transition-all [&[data-state=open]>svg]:rotate-180"
		>
			<ChevronDown
				class="text-muted-foreground size-4 shrink-0 transition-transform duration-200"
			/>
		</Accordion.Trigger>
	</Accordion.Header>

	<AccordionContent class="pt-4">
		<div>
			<Table.Root class="border">
				<Table.Header>
					<Table.Row>
						<Table.Head class="border">Coverage</Table.Head>
						<Table.Head class="border">Benefit</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					<Table.Row>
						<Table.Cell class="whitespace-normal border">
							<p>Daily Hospital Cash due to Covid-19</p>
							<p class="text-muted-foreground">Harian Rawat Inap karena Covid-19</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal border">
							<p>
								Benefit: Rp 1.000.000 per day <br />Maximum up to Rp 14.000.000, Rp 1.000.000 per
								hari
							</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="whitespace-normal border">
							<p>Trip Cancellation & Alteration</p>
							<p class="text-muted-foreground">Pembatalan & Perubahan Perjalanan</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal border">
							<p>Rp 25.000.000</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="whitespace-normal border">
							<p>
								Medical Expenses including Emergency Medical Evacuation (sublimit from Medical
								Expenses Benefits)
							</p>
							<p class="text-muted-foreground">
								Biaya Medis termasuk Evakuasi Medis Darurat (sublimit dari Manfaat Biaya Medis)
							</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal border">
							<p>Rp 700.000.000</p>
						</Table.Cell>
					</Table.Row>
					<Table.Row>
						<Table.Cell class="whitespace-normal border">
							<p>Quarantine or Isolation Cost and Extra Transportation Cost</p>
							<p class="text-muted-foreground">
								Biaya Karantina atau Isolasi dan Biaya Transportasi Tambahan
							</p>
						</Table.Cell>
						<Table.Cell class="whitespace-normal border">
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
	</AccordionContent>
</Accordion.Item>
