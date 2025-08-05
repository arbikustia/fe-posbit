import type { PrefixedInputProps } from '../prefixed-input/types';

export type CountryCode = {
	code: string;
	iso: string;
	name: string;
};

export type PhoneInputProps = Omit<PrefixedInputProps, 'inputPrefix'>;

export type PhoneInputState = {
	selectedCountry: CountryCode;
	phoneNumber: string;
	isCountrySelectOpen: boolean;
	countrySelectTriggerRef: HTMLButtonElement;
};
