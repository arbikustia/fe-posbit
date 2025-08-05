import type { WithChildren } from 'bits-ui';
import type { HTMLInputAttributes } from 'svelte/elements';

export type FileRejectedReason =
	| 'Maximum file size exceeded'
	| 'File type not allowed'
	| 'Maximum files uploaded';

export type FileDropZonePropsWithoutHTML = WithChildren<{
	ref?: HTMLInputElement | null;
	onUpload: (files: File[]) => Promise<void>;
	maxFiles?: number;
	fileCount?: number;
	maxFileSize?: number;
	onFileRejected?: (opts: { reason: FileRejectedReason; file: File }) => void;
	accept?: string;
}>;

export type FileDropZoneProps = FileDropZonePropsWithoutHTML &
	Omit<HTMLInputAttributes, 'multiple' | 'files'>;
