import type { HTMLAttributes } from 'svelte/elements';

export type PreferredProviderProps = {
	value: number[];
	triggerClass?: HTMLAttributes<HTMLDivElement>['class'];
	showIcon?: boolean;
	variant?:string
};
