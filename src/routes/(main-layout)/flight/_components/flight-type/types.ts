import type { HTMLAttributes } from 'svelte/elements';

export type FlightTypeProps = {
	value: string;
	triggerClass?: HTMLAttributes<HTMLDivElement>['class'];
	class?: HTMLAttributes<HTMLDivElement>['class'];
	variant?:string
};
