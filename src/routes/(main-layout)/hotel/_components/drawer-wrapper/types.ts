export interface SelectState<T> {
    isOpenList: boolean;
    rawItems: T[];
    displayedItems: T[];
    filteredItems: T[];
    keyword: string;
    limit: number;
    offset: number;
    loading: boolean;
    searchTimeout: ReturnType<typeof setTimeout> | null;
    triggerRef: HTMLElement;
}
