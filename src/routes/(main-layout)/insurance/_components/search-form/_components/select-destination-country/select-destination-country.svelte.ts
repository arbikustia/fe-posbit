type SelectTripState = {
    isOpenList: boolean
    displayedItems: any[]
    triggerRef: HTMLButtonElement | null
};

const dataOption = [
    { value: 'indonesia', label: 'Indonesia' },
    { value: 'malaysia', label: 'Malaysia' },
    { value: 'singapore', label: 'Singapore' },
    { value: 'thailand', label: 'Thailand' },
    { value: 'vietnam', label: 'Vietnam' },
    { value: 'philippines', label: 'Philippines' },
    { value: 'japan', label: 'Japan' },
    { value: 'south_korea', label: 'South Korea' },
    { value: 'china', label: 'China' },
    { value: 'india', label: 'India' },
    { value: 'australia', label: 'Australia' }
];

export function useSelectDestinationCountry() {
    let state = $state<SelectTripState>({
        isOpenList: false,
        displayedItems: dataOption,
        triggerRef: null
    });

    function closeAndFocusTrigger() {
        state.isOpenList = false;
    }


    return {
        state,
        closeAndFocusTrigger
    };
}