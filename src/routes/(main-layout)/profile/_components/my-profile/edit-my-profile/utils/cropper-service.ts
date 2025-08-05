// lib/services/cropperService.ts

declare global {
	interface Window {
		Cropper: any;
	}
}

export class CropperService {
	private static instance: CropperService;
	private cropperLoaded = false;

	static getInstance(): CropperService {
		if (!CropperService.instance) {
			CropperService.instance = new CropperService();
		}
		return CropperService.instance;
	}

	async loadCropper(): Promise<void> {
		if (this.cropperLoaded) return;

		try {
			// Load CSS first
			await this.loadCSS('https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css');

			// Load Cropper.js
			const response = await fetch(
				'https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js'
			);
			const cropperCode = await response.text();

			// Execute the script
			const script = document.createElement('script');
			script.textContent = cropperCode;
			document.head.appendChild(script);

			// Wait for Cropper to be available
			await new Promise((resolve, reject) => {
				let attempts = 0;
				const checkCropper = () => {
					attempts++;
					if (window.Cropper) {
						resolve(window.Cropper);
					} else if (attempts < 50) {
						setTimeout(checkCropper, 100);
					} else {
						reject(new Error('Cropper.js failed to load'));
					}
				};
				checkCropper();
			});

			this.cropperLoaded = true;
		} catch (error) {
			console.error('Failed to load Cropper.js:', error);
			throw error;
		}
	}

	private loadCSS(url: string): Promise<void> {
		return new Promise((resolve, reject) => {
			const existingLink = document?.querySelector(`link[href="${url}"]`);
			if (existingLink) {
				resolve();
				return;
			}

			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.href = url;
			link.onload = () => resolve();
			link.onerror = () => reject(new Error(`Failed to load CSS: ${url}`));
			document.head.appendChild(link);
		});
	}

	createCropper(image: HTMLImageElement): any {
		if (!window.Cropper) {
			throw new Error('Cropper.js not loaded');
		}

		return new window.Cropper(image, {
			aspectRatio: 1,
			viewMode: 2,
			dragMode: 'move',
			autoCropArea: 0.8,
			restore: false,
			guides: true,
			center: true,
			highlight: false,
			cropBoxMovable: true,
			cropBoxResizable: true,
			toggleDragModeOnDblclick: false,
			background: true,
			responsive: true,
			modal: true,
			minCropBoxWidth: 100,
			minCropBoxHeight: 100,
			ready() {
				console.log('Cropper initialized successfully');
			},
			error(error: any) {
				console.error('Cropper error:', error);
			}
		});
	}

	getCroppedImage(cropperInstance: any): string {
		const canvas = cropperInstance.getCroppedCanvas({
			width: 200,
			height: 200,
			imageSmoothingEnabled: true,
			imageSmoothingQuality: 'high'
		});

		if (!canvas) {
			throw new Error('Failed to get cropped canvas');
		}

		return canvas.toDataURL('image/jpeg', 0.9);
	}

	validateImageFile(file: File): boolean {
		if (!file.type.startsWith('image/')) {
			alert('Please select a valid image file');
			return false;
		}

		if (file.size > 5 * 1024 * 1024) {
			alert('File size must be less than 5MB');
			return false;
		}

		return true;
	}

	readFileAsDataURL(file: File): Promise<string> {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target?.result as string);
			reader.onerror = () => reject(new Error('Failed to read file'));
			reader.readAsDataURL(file);
		});
	}

	get isLoaded(): boolean {
		return this.cropperLoaded;
	}
}