

export function useFormTransaction() {
    const state = $state<any>({
        isOpenPayment: false,
    });

    function closeAndFocusTrigger() {
        state.isOpenPayment = false;
    }
    function openAndFocusTrigger() {
        state.isOpenPayment = true;
    }





    return {
        state,
        closeAndFocusTrigger,
        openAndFocusTrigger
    };
}
