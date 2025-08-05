import type { WithElementRef } from '$lib/utils';
import type { Snippet } from 'svelte';
import type { HTMLInputTypeAttribute, HTMLInputAttributes } from 'svelte/elements';

type InputType = Exclude<HTMLInputTypeAttribute, 'file'>;

export type PrefixedInputProps = WithElementRef<
	Omit<HTMLInputAttributes, 'type'> & { type?: InputType; files?: undefined }
> & {
	inputPrefix: Snippet;
};
