import type { HTMLAttributes } from 'svelte/elements';

export type PaxNumberProps = {
    adult: number;
    child: number;
    triggerClass?: HTMLAttributes<HTMLDivElement>['class'];
    showIcon?: boolean;
    variant?:string
};
