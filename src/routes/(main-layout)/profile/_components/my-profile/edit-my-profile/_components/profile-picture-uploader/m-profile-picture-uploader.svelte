<!-- ProfilePicture.svelte -->
<script lang="ts">
	import Icon from '@iconify/svelte';
	import { onMount } from 'svelte';
	import { CropperService } from '../../utils/cropper-service';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';

	type ProfilePictureProps = {
		profilePicture: string;
		onProfilePictureChange: (data: string) => void;
		onShowCropModal: (imageData: string) => void;
	};

	let { profilePicture, onProfilePictureChange, onShowCropModal }: ProfilePictureProps = $props();

	let fileInput: HTMLInputElement;
	const cropperService = CropperService.getInstance();

	onMount(async () => {
		try {
			await cropperService.loadCropper();
		} catch (error) {
			console.error('Failed to load cropper service:', error);
		}
	});

	async function handleFileSelect(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];

		if (!file) return;

		if (!cropperService.validateImageFile(file)) {
			target.value = '';
			return;
		}

		try {
			const imageData = await cropperService.readFileAsDataURL(file);
			onShowCropModal(imageData);
		} catch (error) {
			console.error('Failed to read file:', error);
			alert('Failed to read the selected file');
		}

		target.value = '';
	}

	function openFileDialog() {
		fileInput?.click();
	}

	function removeProfilePicture() {
		onProfilePictureChange('');
		console.log('Profile picture removed');
	}
</script>

<!-- Hidden file input -->
<!-- svelte-ignore event_directive_deprecated -->
<input
	bind:this={fileInput}
	type="file"
	accept="image/*"
	on:change={handleFileSelect}
	class="hidden"
/>


<div class="mb-6 flex flex-col items-center">
	<div
		class="relative mb-2 flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-200 bg-gray-300 shadow-xs"
	>
		{#if profilePicture}
			<img src={profilePicture} alt="Profile" class="h-full w-full rounded-full object-cover" />
		{:else}
			<Icon icon="tabler:user" class="h-8 w-8 text-gray-500" />
		{/if}

		<Button
			type="button"
			variant="outline"
			onclick={openFileDialog}
			class="absolute bottom-0 right-0 h-8 w-1 rounded-full  shadow-xs"
			title="Edit Profile Picture"
		>
			<Icon icon="tabler:edit" class="h-4 w-4 text-blue-500" />
		</Button>
	</div>

	{#if profilePicture}
		<Button
			variant="link"
			class="text-sm text-blue-600 transition-colors hover:text-blue-800 hover:underline"
			onclick={removeProfilePicture}
		>
			Remove Profile Picture
		</Button>
	{:else}
		<Button
			type="button"
			variant="link"
			class="text-sm text-red-600 transition-colors hover:text-red-800 hover:underline"
			onclick={removeProfilePicture}
		>
			Remove Profile Picture
		</Button>
	{/if}
</div>
