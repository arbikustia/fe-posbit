<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { ChevronLeft } from '@lucide/svelte/icons';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';

	const insuranceDetails = {
		title: 'Zurich Travel Insurance Basic',
		typeOfTrip: 'Short Trip',
		typeOfPlan: 'Individual',
		ageCoverage: '0-70 years',
		areaCoverage: 'Area A',
		destination: 'Singapore',
		startDate: 'Wed, 19 Mar 2025',
		endDate: 'Wed, 19 Mar 2025',
		duration: '1 day(s)',
		insuredPersons: '1 traveler(s)',
		premium: '135,000 IDR',
		stampFee: '10,000 IDR',
		serviceFee: '15,000 IDR',
		total: '160,000 IDR'
	};
</script>

<Dialog.Root>
	<Dialog.Trigger>
		<Button>Select Plan</Button>
	</Dialog.Trigger>

	<Dialog.Content class="w-full rounded-lg px-6 py-2 lg:max-w-[800px]">
		<Dialog.Header class="flex items-start gap-4">
			<!-- <Dialog.Close class="rounded-full p-1 hover:bg-gray-100">
				<ChevronLeft class="h-6 w-6" />
			</Dialog.Close> -->
			<Dialog.Title class="text-sm flex items-end gap-2">
				<Icon icon="lucide:hotel" width="20" height="20" style="color: #1e1e1e" />
				RSP (Reka Sinergi Pratama)
			</Dialog.Title>
			<div class="flex items-center justify-center gap-4">
				<img
					src="https://companieslogo.com/img/orig/ZURN.SW-b8f59ddc.png?t=1720244494"
					class="h-10 w-10"
					alt=""
				/>
				<div class="flex flex-col">
					<div class="text-base font-bold text-gray-700">
						{insuranceDetails.title}
					</div>
					<div class="text-sm">
						<Button variant="link" class="m-0 h-fit w-fit p-0 text-xs underline">Coverage</Button> .
						<Button variant="link" class="m-0 h-fit w-fit p-0 text-xs underline"
							>Premium Charges</Button
						> .
						<Button variant="link" class="m-0 h-fit w-fit p-0 text-xs underline"
							>Product Information</Button
						>
					</div>
				</div>
			</div>
		</Dialog.Header>

		<div class="mt-6 grid gap-8 text-sm md:grid-cols-2">
			<!-- Left Detail -->
			<div>
				<h3 class="mb-3 text-xs font-semibold uppercase text-gray-500">Detail</h3>
				<div class="rounded-lg border border-gray-200 p-4">
					<div class="flex justify-between">
						<p class="text-gray-500">Type of Trip</p>
						<p class="font-medium text-gray-500">{insuranceDetails.typeOfTrip}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">Type of Plan</p>
						<p class="font-medium text-gray-500">{insuranceDetails.typeOfPlan}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">Age Coverage</p>
						<p class="font-medium text-gray-500">{insuranceDetails.ageCoverage}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">Area Coverage</p>
						<p class="font-medium text-gray-500">{insuranceDetails.areaCoverage}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">Destination</p>
						<p class="font-medium text-gray-500">{insuranceDetails.destination}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">Start Date</p>
						<p class="font-medium text-gray-500">{insuranceDetails.startDate}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">End Date</p>
						<p class="font-medium text-gray-500">{insuranceDetails.endDate}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">Duration</p>
						<p class="font-medium text-gray-500">{insuranceDetails.duration}</p>
					</div>
					<div class="flex justify-between">
						<p class="text-gray-500">Insured Person</p>
						<p class="font-medium text-gray-500">{insuranceDetails.insuredPersons}</p>
					</div>
				</div>
			</div>

			<!-- Right Fare Detail -->
			<div>
				<h3 class="mb-3 text-xs font-semibold uppercase text-gray-500">Fare Detail</h3>
				<div class="h-fit rounded-lg border border-gray-200 p-4">
					<div class="">
						<div class="flex justify-between">
							<p class="text-gray-600">Premium</p>
							<p class="font-medium text-gray-600">{insuranceDetails.premium}</p>
						</div>
						<div class="flex justify-between">
							<p class="text-gray-600">Stamp Fee</p>
							<p class="font-medium text-gray-600">{insuranceDetails.stampFee}</p>
						</div>
						<div class="flex justify-between">
							<p class="text-gray-600">Service Fee</p>
							<p class="font-medium text-gray-600">{insuranceDetails.serviceFee}</p>
						</div>
					</div>
					<div class="mt-4 flex justify-between border-t pt-3 text-base">
						<p class="">Total</p>
						<p class="font-medium">{insuranceDetails.total}</p>
					</div>
				</div>
			</div>
		</div>

		<Dialog.Footer class="mt-6 flex justify-between">
			<Button variant="ghost" class="text-gray-500">Change Plan</Button>
			<Button>Continue</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
