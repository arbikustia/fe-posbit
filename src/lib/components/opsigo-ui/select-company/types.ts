import type { HTMLAttributes } from 'svelte/elements';

export type SelectCompanyProps = {
	value: string;
	triggerClass?: HTMLAttributes<HTMLDivElement>['class'];
	showIcon?: boolean;
	showSelectedCode?: boolean;
};
