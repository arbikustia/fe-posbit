<script lang="ts">
    import Button from "$lib/components/ui/button/button.svelte";
    import * as Table from "$lib/components/ui/table/index.js";
    import Icon from "@iconify/svelte";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { insurancePlans } from "./insurance-data.js";

    export let plans: any[];
    let expandedRow: number | null = null;

    function toggleRow(planId: number) {
        expandedRow = expandedRow === planId ? null : planId;
    }
</script>

<div class="w-full overflow-x-auto">
	<Table.Root class="min-w-[800px]">
		<Table.Header>
			<Table.Row>
				<Table.Head class="w-[50px] font-medium">No</Table.Head>
				<Table.Head class="min-w-[180px] max-w-[250px] font-medium">Product</Table.Head>
				<Table.Head class="min-w-[150px] max-w-[250px] font-medium">Area</Table.Head>
				<Table.Head class="w-[120px] font-medium">Age</Table.Head>
				<Table.Head class="w-[100px] font-medium">Claim</Table.Head>
				<Table.Head class="w-[100px] font-medium">Price</Table.Head>
				<Table.Head class="w-[120px] text-right font-medium"></Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each plans as plan, index (plan.id)}
				<!-- Main insurance plan row -->
				<Table.Row
					class="cursor-pointer border-b transition-colors hover:bg-gray-50"
					onclick={() => toggleRow(plan.id)}
				>
					<Table.Cell class="w-[50px] font-medium">{index + 1}</Table.Cell>
					<Table.Cell class="min-w-[180px] max-w-[250px]">
						<div class="break-words font-medium text-gray-900">{plan.planName}</div>
					</Table.Cell>
					<Table.Cell class="min-w-[150px] max-w-[250px]">
						<div class="break-words text-gray-600">{plan.coverage}</div>
					</Table.Cell>
					<Table.Cell class="w-[120px]">
						<div class="break-words text-gray-600">{plan.ageRange}</div>
					</Table.Cell>
					<Table.Cell class="w-[100px]">
						<span
							class="inline-flex items-center break-words rounded-md px-2 py-1 text-xs font-medium"
							class:bg-blue-100={plan.type === 'Cashless'}
							class:text-blue-800={plan.type === 'Cashless'}
							class:bg-purple-100={plan.type === 'Reimbursement'}
							class:text-purple-800={plan.type === 'Reimbursement'}
						>
							{plan.type}
						</span>
					</Table.Cell>
					<Table.Cell class="w-[100px]">
						<div class="break-words font-medium text-blue-600">{plan.currency} {plan.price.toLocaleString()}</div>
					</Table.Cell>
					<Table.Cell class="w-[100px]">
						<Button
							onclick={(e) => {
								e.stopPropagation();
							}}
							variant="default"
							class="flex items-center justify-center whitespace-nowrap"
						>
							<span>Select</span>
						</Button>
					</Table.Cell>
					<Table.Cell class="w-[120px] text-right">
						<div
							class="flex items-center justify-center gap-2 transition-transform duration-200 {expandedRow ===
							plan.id
								? '-rotate-90'
								: 'rotate-90'}"
						>
							<Icon icon="material-symbols:arrow-forward-ios-rounded" width="16" height="16" />
						</div>
					</Table.Cell>
				</Table.Row>

				<!-- Collapsible feature details -->
				{#if expandedRow === plan.id}
					<Table.Row class="border-b bg-white">
						<Table.Cell colspan={7} class="p-0">
							<div class="w-full bg-white p-4">
								<!-- Tabs -->
								<Tabs.Root value="coverage" class="w-full shadow-none">
									<Tabs.List class="flex border-b bg-transparent text-sm font-medium shadow-none">
										<Tabs.Trigger
											value="coverage"
											class="rounded-none border-b-2 bg-transparent px-4 py-2 data-[state=active]:border-b-blue-600"
										>
											Coverage
										</Tabs.Trigger>
										<Tabs.Trigger
											value="premium-charges"
											class="rounded-none border-b-2 bg-transparent px-4 py-2 data-[state=active]:border-b-blue-600"
										>
											Premium Charges
										</Tabs.Trigger>
										<Tabs.Trigger
											value="claim"
											class="rounded-none border-b-2 bg-transparent px-4 py-2 data-[state=active]:border-b-blue-600"
										>
											Claim
										</Tabs.Trigger>
									</Tabs.List>

									<!-- Tab Content: Coverage -->
									<Tabs.Content value="coverage" class="mt-4">
										<table class="w-full border border-gray-200 text-sm">
											<thead class="bg-gray-100 font-medium text-gray-700">
												<tr>
													<th class="w-[50px] px-4 py-2 text-left">No</th>
													<th class="px-4 py-2 text-left">Coverage</th>
													<th class="px-4 py-2 text-left">Amount</th>
												</tr>
											</thead>
											<tbody class="text-gray-700">
												{#each plan.features as feature, i (feature.name)}
													<tr class="border-t">
														<td class="px-4 py-2 align-top">{String.fromCharCode(65 + i)}.</td>
														<td class="px-4 py-2">
															<div class="font-semibold">{feature.name}</div>
															<div class="italic text-gray-500">
																{#if feature.name === 'Delay & Cancellation'}
																	Pembatalan & Perubahan Perjalanan
																{:else if feature.name === 'Baggage Protection'}
																	Perlindungan Bagasi
																{:else if feature.name === 'Accident & Medical Expense'}
																	Biaya Kecelakaan & Medis
																{/if}
															</div>
														</td>
														<td class="px-4 py-2">{feature.coverage}</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</Tabs.Content>

									<Tabs.Content value="premium-charges" class="mt-4">
										<table class="w-full border border-gray-200 text-sm">
											<thead class="bg-gray-100 font-medium text-gray-700">
												<tr>
													<th class="px-4 py-2 text-left">Period</th>
													<th class="px-4 py-2 text-left">Charges</th>
												</tr>
											</thead>
											<tbody class="text-gray-700">
												{#each plan.premiumCharges as charge (charge.period)}
													<tr class="border-t">
														<td class="px-4 py-2">{charge.period}</td>
														<td class="px-4 py-2">{charge.charge}</td>
													</tr>
												{/each}
											</tbody>
										</table>
									</Tabs.Content>

									<Tabs.Content value="claim" class="mt-4">
										<div class="text-sm text-gray-600">
											<p class="font-medium">Claim Process:</p>
											<p>{plan.claimDetails}</p>
										</div>
									</Tabs.Content>
								</Tabs.Root>
							</div>
						</Table.Cell>
					</Table.Row>
				{/if}
			{/each}
		</Table.Body>
	</Table.Root>
</div>