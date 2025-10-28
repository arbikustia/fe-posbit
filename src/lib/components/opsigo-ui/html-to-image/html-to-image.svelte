<script lang="ts">
	import { Button, type ButtonProps } from '$lib/components/ui/button';
	import { cn, webShare } from '$lib/utils';
	import LoaderCircle  from '@lucide/svelte/icons/loader-circle';
	import type { Snippet } from 'svelte';
	import { toBlob } from 'html-to-image';
	import { toast } from 'svelte-sonner';

	type HtmltoImageProps = {
		filename?: string;
		html: Snippet;
		class?: string;
		onAction?: (callback: () => {}) => void;
		actionContent: Snippet<[{ isProcessing: boolean }]>;
		useShareApi?: boolean;
	} & ButtonProps;

	let {
		filename = 'image.png',
		html,
		class: className,
		onAction,
		actionContent,
		useShareApi = false,
		...props
	}: HtmltoImageProps = $props();

	let elementToRender = $state<HTMLElement>()!;

	let isProcessing = $state(false);

	async function handleAction() {
		if (!elementToRender) {
			toast.error('Element not found');
			return;
		}

		if (!isProcessing) {
			try {
				isProcessing = true;
				const blob = await toBlob(elementToRender, {
					cacheBust: true, // Untuk memastikan resource terbaru
					pixelRatio: 2 // Untuk kualitas gambar lebih tinggi (retina)
				});

				if (blob) {
					if (useShareApi) {
						await webShare({
							files: [new File([blob], filename, { type: blob.type })],
							title: 'Shared Image'
						});
					} else {
						const clipboardSupported = !!navigator.clipboard?.write && !!window.ClipboardItem;
						if (clipboardSupported) {
							await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
							toast.success('Image successfully copied to clipboard!');
						} else {
							downloadBlob(blob);
						}
					}
				}
			} catch (err) {
				toast.error('Failed to create image, please try again');
			} finally {
				isProcessing = false;
			}
		}
	}

	function downloadBlob(blob: Blob) {
		const url = URL.createObjectURL(blob);
		downloadDataUrl(url);
		URL.revokeObjectURL(url);
		toast.info('Clipboard not supported, images are downloaded as files');
	}

	function downloadDataUrl(dataUrl: string) {
		const a = document.createElement('a');
		a.download = filename;
		a.href = dataUrl;
		a.click();
	}
</script>

<div class="absolute -left-[9999px] -top-[9999px]">
	<div bind:this={elementToRender}>
		{@render html()}
	</div>
</div>

<Button
	onclick={() => {
		if (onAction) {
			onAction(handleAction);
		} else {
			handleAction();
		}
	}}
	class={cn(className)}
	{...props}
	disabled={isProcessing || props.disabled}
>
	{#if isProcessing}
		<div class="flex w-full items-center justify-center">
			<LoaderCircle class="animate-spin" />
		</div>
	{:else}
		{@render actionContent({ isProcessing })}
	{/if}
</Button>
