import { localStorageKey } from '$lib/constants/local-storage';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import { airportService } from '$lib/services/flight/airportService';
import type { Airport } from '$lib/types/Airport';
import { onMount } from 'svelte';
import type { GroupedAirport, SelectAirportState } from './types';

export function useSelectAirport() {
	const state = $state<SelectAirportState>({
		isOpenList: false,
		airports: [],
		groupedAirports: {},
		displayedAirports: [],
		filteredAirports: [],
		keyword: '',
		limit: 30,
		offset: 0,
		loading: false,
		searchTimeout: null,
		triggerRef: null!
	});

	function getSelectedAirportDisplay(value: string) {
		let airportObj = state.airports.find((f) => f.airportCode === value);
		if (value === '') {
			return '';
		}
		return airportObj ? `${airportObj.cityName} (${airportObj.airportCode})` : '';
	}

	async function loadAirports() {
		let data: Airport[] = [];
		const airportLocalStorage = localStorageHelper.getItem<Airport[]>(
			localStorageKey.autoComplete.airport
		);
		if (airportLocalStorage) {
			data = airportLocalStorage;
		} else {
			data = await airportService.getAll();
			localStorageHelper.setItem(localStorageKey.autoComplete.airport, data);
		}
		state.airports = data;

		groupAirports();
	}

	function groupAirports(): void {
		state.groupedAirports = state.airports.reduce(
			(acc: Record<string, GroupedAirport>, airport: Airport) => {
				const { cityCode, isMetropolitan } = airport;

				if (!acc[cityCode]) {
					acc[cityCode] = { parent: null, children: [] };
				}

				if (isMetropolitan) {
					acc[cityCode].parent = airport;
				} else {
					acc[cityCode].children.push(airport);
				}

				return acc;
			},
			{}
		);

		applySearch();
	}

	function handleSearchDebounce(): void {
		if (state.searchTimeout) clearTimeout(state.searchTimeout);

		state.searchTimeout = setTimeout(() => {
			applySearch();
		}, 300);
	}

	function applySearch(): void {
		const searchLower = state.keyword.toLowerCase().trim();

		const filtered = Object.values(state.groupedAirports)
			.map(({ parent, children }) => {
				const matchedChildren = children.filter((child) =>
					[child.airportName, child.cityName, child.airportCode, child.countryName].some((field) =>
						field.toLowerCase().includes(searchLower)
					)
				);

				if (
					parent &&
					[parent.airportName, parent.cityName, parent.airportCode, parent.countryName].some(
						(field) => field.toLowerCase().includes(searchLower)
					)
				) {
					return { parent, children };
				}

				if (matchedChildren.length > 0) {
					return { parent: null, children: matchedChildren };
				}

				return null;
			})
			.filter(Boolean) as GroupedAirport[];

		// Prioritizing exact matches with airportCode
		filtered.sort((a, b) => {
			const aHasExactMatch = a.children.some(
				(child) => child.airportCode.toLowerCase() === searchLower
			);
			const bHasExactMatch = b.children.some(
				(child) => child.airportCode.toLowerCase() === searchLower
			);

			return Number(bHasExactMatch) - Number(aHasExactMatch);
		});

		state.filteredAirports = filtered;
		state.displayedAirports = [];
		state.offset = 0;
		state.loading = false;

		if (filtered.length === 0) {
			state.loading = false;
		} else {
			loadMore();
		}
	}

	function loadMore(): void {
		if (state.loading) return;
		state.loading = true;

		const source =
			state.filteredAirports.length > 0
				? state.filteredAirports
				: Object.values(state.groupedAirports);
		if (state.offset >= source.length) {
			state.loading = false;
			return;
		}

		state.displayedAirports = [
			...state.displayedAirports,
			...source.slice(state.offset, state.offset + state.limit)
		];
		state.offset += state.limit;
		state.loading = false;
	}

	function handleScroll(event: Event): void {
		const target = event.target as HTMLElement;
		if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
			loadMore();
		}
	}

	async function resetList() {
		await new Promise((resolve) => setTimeout(resolve, 300));
		state.keyword = '';
		applySearch();
	}

	onMount(() => {
		loadAirports();
	});

	return {
		state,
		getSelectedAirportDisplay,
		handleScroll,
		resetList,
		handleSearchDebounce
	};
}
