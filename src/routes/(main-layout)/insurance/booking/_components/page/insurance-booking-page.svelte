<script lang="ts">
	import { page } from '$app/state';
	import * as Form from '$lib/components/ui/form';
	import { slide } from 'svelte/transition';
	import { AdditionalBenefitForm } from '../additional-benefit-form';
	import { BookingSummary } from '../booking-summary';
	import { ContactForm } from '../contact-form';
	import { ImportTraveler } from '../import-traveler';
	import { PolicyHolderForm } from '../policy-holder-form';
	import { TravelerForm } from '../traveler-form';
	import { useInsuranceBookingPage } from './insurance-booking-page.svelte.js';
	import { Button } from '$lib/components/ui/button';
	import { FareDetail } from '../fare-detail';

	const type = $derived(page.url.searchParams.get('type'));

	const { state, form, formData, errors, enhance, handleSubmit, saveAsDraft } =
		useInsuranceBookingPage();
</script>

<div class="container space-y-4">
	<h1 class="mb-8 text-3xl font-semibold">Booking Form</h1>

	<div class="grid grid-cols-5 gap-6">
		<!-- Left Side -->
		<div class="col-span-3">
			<form use:enhance onsubmit={handleSubmit} enctype="multipart/form-data">
				<div class="space-y-6">
					<AdditionalBenefitForm {form} />
					{#if type === 'group'}
						<ImportTraveler bind:value={state.importedTravelers} />
						{#if state.importedTravelers.length > 0}
							<PolicyHolderForm {form} />
						{/if}
					{:else if $formData.travelers}
						{#each $formData.travelers as _, i}
							<TravelerForm {form} formIdx={i} />
						{/each}
					{/if}

					{#if (type === 'group' && state.importedTravelers.length > 0) || type !== 'group'}
						<ContactForm {form} />
						<div class="flex gap-4">
							<Button
								size="lg"
								type="button"
								class="flex-1"
								variant="outline"
								onclick={saveAsDraft}
							>
								Save as Draft
							</Button>
							<Form.Button size="lg" class="flex-1">Quote Now</Form.Button>
						</div>
					{/if}
				</div>
			</form>
		</div>

		<!-- Right Side -->
		<div class="col-span-2">
			<div class="sticky top-4 space-y-4">
				<div transition:slide>
					<BookingSummary />
				</div>
				<div transition:slide>
					<FareDetail />
				</div>
			</div>
		</div>
	</div>
</div>
