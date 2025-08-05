import { tick } from 'svelte';
import type { CountryCode, PhoneInputState } from './types';
import dummyCountry from '$lib/dummy/country-phone-code.json';

export function usePhoneInput() {
	const countries: CountryCode[] = dummyCountry;

	const state = $state<PhoneInputState>({
		selectedCountry: countries[0],
		phoneNumber: '',
		isCountrySelectOpen: false,
		countrySelectTriggerRef: null!
	});

	// Format phone number as user types
	function handlePhoneInput(e: Event, setValue: (phone: string) => void): void {
		const target = e.target as HTMLInputElement;
		const input = target.value.replace(/\D/g, '');
		state.phoneNumber = input;

		setValue(getFullPhoneNumber(state.selectedCountry.code, input));
	}

	function getFullPhoneNumber(code: string, phone: string) {
		if (!phone) {
			return '';
		}
		return `${code} ${phone}`;
	}

	function getFlagImage(iso: string) {
		return `https://flagcdn.com/w20/${iso.toLowerCase().replace('+', '')}.png`;
	}

	function handleSelectCountry(country: CountryCode, setValue: (phone: string) => void) {
		state.selectedCountry = country;
		setValue(getFullPhoneNumber(country.code, state.phoneNumber));
		closeAndFocusCountrySelectTrigger();
	}

	function closeAndFocusCountrySelectTrigger() {
		state.isCountrySelectOpen = false;
		tick().then(() => {
			state.countrySelectTriggerRef.focus();
		});
	}

	return {
		state,
		countries,
		handlePhoneInput,
		getFlagImage,
		handleSelectCountry,
		closeAndFocusCountrySelectTrigger
	};
}
