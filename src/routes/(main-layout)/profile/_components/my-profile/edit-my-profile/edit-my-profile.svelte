<!-- ProfileForm.svelte -->
<script lang="ts">
	export { profileSchema };
	import * as Card from '$lib/components/ui/card';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { SuperForm } from 'sveltekit-superforms';
	import { profileSchema, type IprofileSchema, defaultFormData } from './shema';
	import CropModal from './_components/cropper-modal/CropperModal.svelte';
	import ProfileFormFields from './_components/profile-form-fields/profile-form-fields.svelte';
	import { ProfilePictureuploader } from './_components/profile-picture-uploader';
	import { ProfileFormField } from './_components/profile-form-fields';

	type ProfileFormProps = {
		form: SuperForm<IprofileSchema>;
		onCancel: () => void;
	};

	let { form, onCancel }: ProfileFormProps = $props();
	const { form: formData } = form;

	// Profile picture and crop modal states
	let profilePictureData = $state('');
	let showCropModal = $state(false);
	let selectedImage = $state('');

	// Initialize default values
	Object.assign($formData, defaultFormData);

	function handleProfilePictureChange(data: string) {
		profilePictureData = data;
		$formData.profilePicture = data;
	}

	function handleShowCropModal(imageData: string) {
		selectedImage = imageData;
		showCropModal = true;
	}

	function handleCropSave(croppedData: string) {
		handleProfilePictureChange(croppedData);
		handleCropClose();
	}

	function handleCropClose() {
		showCropModal = false;
		selectedImage = '';
	}
</script>

<!-- Crop Modal -->
<CropModal
	showModal={showCropModal}
	{selectedImage}
	onClose={handleCropClose}
	onSave={handleCropSave}
/>

<!-- Main Form -->
<form class="h-full">
	<Card.Root class="mx-auto">
		<Card.Content class="p-6">
			<!-- Profile Picture Section -->
			<ProfilePictureuploader
				profilePicture={profilePictureData}
				onProfilePictureChange={handleProfilePictureChange}
				onShowCropModal={handleShowCropModal}
			/>

			<!-- Form Fields -->
			<ProfileFormField {form} />
		</Card.Content>
	</Card.Root>

	<!-- Save Button -->
	<div class="mt-5 flex justify-end gap-5">
		<Button variant="outline" onclick={onCancel} class="">Close</Button>
		<Button class="">Save Changes</Button>
	</div>
</form>
