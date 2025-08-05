type SelectCountriesState = {
    hasSwitch: boolean;
};

export function useSelectCountries() {
    const state = $state<SelectCountriesState>({
        hasSwitch: false
    });

    return {
        state
    };
}
