<!-- CropModal.svelte -->
<script lang="ts">
	
	import * as Dialog from '$lib/components/ui/dialog';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
	import { tick, onDestroy } from 'svelte';
	import { CropperService } from '../../utils/cropper-service';

	type CropModalProps = {
		showModal: boolean;
		selectedImage: string;
		onClose: () => void;
		onSave: (croppedData: string) => void;
	};

	let { showModal, selectedImage, onClose, onSave }: CropModalProps = $props();
	// svelte-ignore non_reactive_update
	let cropperImage: HTMLImageElement;
	let cropperInstance: any = null;
	const cropperService = CropperService.getInstance();

	async function initializeCropper() {
		if (!cropperImage || !selectedImage || !cropperService.isLoaded) {
			console.log('Cropper initialization conditions not met');
			return;
		}

		try {
			// Wait for image to load
			await new Promise((resolve, reject) => {
				if (cropperImage.complete) {
					resolve(undefined);
				} else {
					cropperImage.onload = () => resolve(undefined);
					cropperImage.onerror = () => reject(new Error('Failed to load image'));
				}
			});

			// Destroy existing cropper if any
			if (cropperInstance) {
				cropperInstance.destroy();
				cropperInstance = null;
			}

			// Wait for DOM to settle
			await tick();
			await new Promise((resolve) => setTimeout(resolve, 100));

			// Initialize new cropper
			cropperInstance = cropperService.createCropper(cropperImage);
		} catch (error) {
			console.error('Failed to initialize cropper:', error);
			alert('Failed to initialize image cropper. Please try again.');
		}
	}

	function cropAndSave() {
		if (!cropperInstance) {
			console.error('Cropper instance not available');
			alert('Cropper is not ready. Please try again.');
			return;
		}

		try {
			const croppedImageData = cropperService.getCroppedImage(cropperInstance);
			onSave(croppedImageData);
			console.log('Profile picture saved with Cropper.js:', {
				dataLength: croppedImageData.length,
				timestamp: new Date().toISOString(),
				dimensions: '200x200px'
			});
		} catch (error) {
			console.error('Failed to crop image:', error);
			alert('Failed to crop image. Please try again.');
		}
	}

	function handleClose() {
		if (cropperInstance) {
			cropperInstance.destroy();
			cropperInstance = null;
		}
		onClose();
	}

	function rotateImage(degree: number) {
		cropperInstance?.rotate(degree);
	}

	function zoomImage(ratio: number) {
		cropperInstance?.zoom(ratio);
	}

	function resetCrop() {
		cropperInstance?.reset();
	}

	onDestroy(() => {
		if (cropperInstance) {
			cropperInstance.destroy();
		}
	});

	// Watch for modal state changes
	$effect(() => {
		if (showModal && selectedImage && cropperService.isLoaded) {
			setTimeout(async () => {
				await tick();
				await initializeCropper();
			}, 200);
		}
	});
</script>

<Dialog.Root bind:open={showModal}>
	<Dialog.Content class="max-w-2xl flex gap-4 flex-col items-start">
		<Dialog.Header>
			<Dialog.Title class="flex items-start">
				<Icon icon="tabler:crop" class="h-5 w-5" />
				Crop Profile Picture
			</Dialog.Title>
			<Dialog.Description>
				Use the tools below to crop and adjust your profile picture. The image will be resized to
				200x200 pixels.
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4">
			{#if selectedImage}
				{#if !cropperService.isLoaded}
					<div class="flex items-center justify-center p-8">
						<div class="text-center">
							<div
								class="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-500"
							></div>
							<p class="text-sm text-gray-500">Loading image editor...</p>
						</div>
					</div>
				{:else}
					<div class="relative overflow-hidden rounded-lg bg-gray-100">
						<img
							bind:this={cropperImage}
							src={selectedImage}
							alt="Crop Preview"
							class="block max-h-96 max-w-full"
							style="max-height: 400px;"
						/>
					</div>

					<div class="flex flex-wrap justify-start gap-3">
						<Button
							variant="outline"
							size="sm"
							onclick={() => rotateImage(-90)}
							class="flex items-center gap-1"
						>
							<Icon icon="tabler:rotate-2" class="h-4 w-4" />
							Rotate Left
						</Button>

						<Button
							variant="outline"
							size="sm"
							onclick={() => rotateImage(90)}
							class="flex items-center gap-1"
						>
							<Icon icon="tabler:rotate-clockwise-2" class="h-4 w-4" />
							Rotate Right
						</Button>

						<Button
							variant="outline"
							size="sm"
							onclick={() => zoomImage(0.1)}
							class="flex items-center gap-1"
						>
							<Icon icon="tabler:zoom-in" class="h-4 w-4" />
							Zoom In
						</Button>

						<Button
							variant="outline"
							size="sm"
							onclick={() => zoomImage(-0.1)}
							class="flex items-center gap-1"
						>
							<Icon icon="tabler:zoom-out" class="h-4 w-4" />
							Zoom Out
						</Button>

						<Button variant="outline" size="sm" onclick={resetCrop} class="flex items-center gap-1">
							<Icon icon="tabler:refresh" class="h-4 w-4" />
							Reset
						</Button>
					</div>
				{/if}
			{/if}
		</div>

		<Dialog.Footer class="flex justify-between gap-3 w-full">
			<Button variant="outline" onclick={handleClose}>
				<Icon icon="tabler:x" class="mr-1 h-4 w-4" />
				Cancel
			</Button>
			<Button onclick={cropAndSave} class="flex items-center gap-1">
				<Icon icon="tabler:check" class="h-4 w-4" />
				Save & Apply
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
