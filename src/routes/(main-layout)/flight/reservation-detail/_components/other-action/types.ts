import type { Snippet } from 'svelte';

export type OtherActionItemProps = {
	icon: Snippet;
	label: string;
	onClick: () => void;
};
