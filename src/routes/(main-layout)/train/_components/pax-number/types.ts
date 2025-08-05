import type { HTMLAttributes } from 'svelte/elements';

export type PaxNumberProps = {
	adult: number;
	infant: number;
	triggerClass?: HTMLAttributes<HTMLDivElement>['class'];
	showIcon?: boolean;
	variant?:string
};

export type PaxNumberState = {
	adult: number;
	infant: number;
	isOpenList: boolean;
	triggerRef: HTMLButtonElement;
};
