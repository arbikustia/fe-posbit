<script lang="ts">
	import { page } from '$app/state';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { Button } from '$lib/components/ui/button';
	import { formatThousand } from '$lib/helpers/number-helper';
	import { ChevronUp } from '@lucide/svelte';
	import { MAdditionalBenefitForm } from '../additional-benefit-form';
	import { MContactForm } from '../contact-form';
	import { useInsuranceBookingPage } from './insurance-booking-page.svelte.js';
	import { MTravelerForm } from '../traveler-form';
	import { MBookingSummary } from '../booking-summary';
	import { MImportTraveler } from '../import-traveler';
	import { MPolicyHolderForm } from '../policy-holder-form';
	import { MFareDetail } from '../fare-detail';

	const type = $derived(page.url.searchParams.get('type'));

	const { state, form, formData, errors, enhance, handleSubmit, saveAsDraft } =
		useInsuranceBookingPage();
</script>

<MOSGAppBar class="bg-primary text-primary-foreground">
	{#snippet leftContent()}
		<h1 class="text-lg font-semibold">Booking Form</h1>
	{/snippet}
</MOSGAppBar>

<div class="relative px-4 pb-28 pt-20">
	<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data">
		<div class="mt-4 space-y-4">
			<MBookingSummary />
			<div class="text-lg font-semibold">Additional Benefit</div>
			<MAdditionalBenefitForm {form} />
			{#if type === 'group'}
				<div class="text-lg font-semibold">Import Traveler</div>
				<MImportTraveler bind:value={state.importedTravelers} />
				{#if state.importedTravelers.length > 0}
					<div class="text-lg font-semibold">Policy Holder</div>
					<MPolicyHolderForm
						bind:parentFormData={$formData}
						isError={!!$errors.policyHolder?.name}
					/>
				{/if}
			{/if}
			{#if $formData.travelers}
				<div class="text-lg font-semibold">Traveler Detail</div>
				{#each $formData.travelers as _, i}
					<MTravelerForm
						bind:parentFormData={$formData}
						formIdx={i}
						isError={!!$errors?.travelers?.[i]?.title}
					/>
				{/each}
			{/if}
		</div>

		{#if (type === 'group' && state.importedTravelers.length > 0) || type !== 'group'}
			<div class="my-4 space-y-4">
				<div class="text-lg font-semibold">Booking Contact</div>
				<MContactForm bind:parentFormData={$formData} isError={!!$errors.title} />
			</div>
			<div
				class="fixed bottom-0 left-0 right-0 flex items-center justify-between border-t-2 bg-white p-4"
			>
				<div>
					<p class="text-sm">Total for all pax</p>
					<MFareDetail />
				</div>
				<div class="flex items-center gap-4">
					<Button size="lg" type="button" variant="link" class="h-fit p-0" onclick={saveAsDraft}>
						Save as Draft
					</Button>
					<Button type="submit" class="px-8">Quote</Button>
				</div>
			</div>
		{/if}
	</form>
</div>
