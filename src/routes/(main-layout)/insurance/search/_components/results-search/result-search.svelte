<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Icon from '@iconify/svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import TableResult from './table-result.svelte';
	import ShareInsurance from '../../../_components/share-insurance/share-insurance.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	interface AreaCoverage {
		id: string;
		name: string;
		checked: boolean;
	}
	// Import state and actions from result.svelte.ts
	import {
		currentView,
		sortedPlans,
		sortOption,
		expandedCard,
		sharehotels,
		handleSortChange,
		formatPrice,
		selectPlan,
		showMoreDetails,
		toggleCard,
		setView,
		getActiveFiltersCount,

		type SortOption

	} from './search-result.svelte';
	import { SummaryInsurance } from '../summary-insurance';

	$: activeFiltersCount = getActiveFiltersCount();

	// Helper function to format age range display
	function formatAgeRange(ageRange: number[]): string {
		return `${ageRange[0]}-${ageRange[1]} years old`;
	}

	// Helper function to format coverage display
	function formatCoverage(coverage: AreaCoverage[]): string {
		const worldwide = coverage.find((c) => c.id === 'worldwide')?.checked;
		const usa = coverage.find((c) => c.id === 'usa')?.checked;
		const canada = coverage.find((c) => c.id === 'canada')?.checked;

		if (worldwide && usa && canada) {
			return 'Worldwide';
		} else if (worldwide && !usa && !canada) {
			return 'Worldwide Excluding USA, Canada';
		} else {
			// Handle other cases if needed
			return 'Custom Coverage';
		}
	}
</script>

{#snippet Summary()}
	<SummaryInsurance />
{/snippet}

<section class="py-6">
	<Tabs.Root value="card" class="w-full">
		<div class="flex items-start justify-between">
			<div class="flex items-center gap-2">
				<span class="text-xl font-semibold">Show {$sortedPlans.length} Results</span>
			</div>
			<div class="flex items-center gap-3">
				<Tabs.List>
					<Tabs.Trigger value="card">
						<Icon icon="ic:sharp-list" width="24" height="24" style="color: #6f6f6f" />
					</Tabs.Trigger>
					<Tabs.Trigger value="table">
						<Icon icon="fluent:table-20-regular" width="20" height="20" style="color: #6f6f6f" />
					</Tabs.Trigger>
				</Tabs.List>
				<ShareInsurance
					insurance={$sortedPlans}
				/>

				<Select.Root
					type="single"
					bind:value={$sortOption}
					onValueChange={(e:string) => handleSortChange(e as SortOption)}
				>
					<Select.Trigger class="w-[180px]">{$sortOption}</Select.Trigger>
					<Select.Content>
						<Select.Item value="Price Low to High">Price Low to High</Select.Item>
						<Select.Item value="Price High to Low">Price High to Low</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<Tabs.Content value="card">
			<div class="space-y-3">
				{#each $sortedPlans as plan}
					<Card.Root class="border border-gray-200 hover:shadow-md">
						<Card.Content class="">
							<!-- Header Section -->
							<div class="mb-6 flex items-start justify-between">
								<div class="flex items-center justify-center gap-4">
									<!-- Logo -->
									<div class="flex-shrink-0">
										<div
											class="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gray-100 bg-white shadow-sm"
										>
											<Icon icon={plan.logo} class="h-8 w-8" style="color: {plan.logoColor}" />
										</div>
									</div>

									<!-- Plan Details -->
									<div class="flex-1">
										<h3 class="mb-2 text-lg font-semibold text-gray-900">{plan.planName}</h3>
										<div class="space-y-1 text-sm text-gray-600">
											<div class="flex items-center gap-2">
												<Icon icon="material-symbols:location-on" class="h-4 w-4" />
												<span>{formatCoverage(plan.coverage)}</span>
											</div>
											<div class="flex items-center gap-2">
												<Icon icon="material-symbols:person" class="h-4 w-4" />
												<span>{formatAgeRange(plan.ageRange)}</span>
											</div>
											<div class="flex items-center gap-2">
												<Icon icon="material-symbols:payments" class="h-4 w-4" />
												<span>{plan.type}</span>
											</div>
										</div>
									</div>
								</div>

								<!-- Price and Select Button -->
								<div class="text-right">
									<div class="mb-3">
										<span class="text-xl font-bold text-red-600"
											>{formatPrice(plan.price)} {plan.currency}</span
										>
										<span class="ml-1 text-sm text-gray-500">/pax</span>
									</div>
									{@render Summary()}
								</div>
							</div>

							<!-- Features Section -->
							<div class="border-t pt-1">
								<div class="flex items-center justify-between">
									<div class="flex items-center gap-8">
										{#each plan.features as feature}
											<div class="text-center">
												<div class="mb-2 flex justify-center">
													<div
														class="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50"
													>
														<Icon icon={feature.icon} class="h-6 w-6 text-gray-600" />
													</div>
												</div>
												<h4 class="mb-1 text-sm font-medium text-gray-900">{feature.name}</h4>
												<p class="text-xs text-gray-500">Coverage up to</p>
												<p class="text-xs font-semibold text-gray-700">{feature.coverage}</p>
											</div>
										{/each}
									</div>

									<div class="border-t pt-1">
										<div class="flex items-center justify-between">
											<Button
												variant="outline"
												onclick={(e) => {
													e.stopPropagation(), toggleCard(plan.id);
												}}
											>
												{$expandedCard === plan.id ? 'Hide Detail' : 'More Detail'}
											</Button>
										</div>
									</div>
								</div>
							</div>
						</Card.Content>
					</Card.Root>

					{#if $expandedCard === plan.id}
						<Card.Root class="border border-gray-200 hover:shadow-md">
							<Card.Content class="">
								<div class="">
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
							</Card.Content>
						</Card.Root>
					{/if}
				{/each}
			</div>
		</Tabs.Content>
		<Tabs.Content value="table">
			<Card.Root>
				<Card.Content class="">
					<TableResult plans={$sortedPlans} />
				</Card.Content>
			</Card.Root>
		</Tabs.Content>
	</Tabs.Root>
</section>
