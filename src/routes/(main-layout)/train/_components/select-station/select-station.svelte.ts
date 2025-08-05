import { localStorageKey } from '$lib/constants/local-storage';
import localStorageHelper from '$lib/helpers/local-storage-helper';
import { onMount } from 'svelte';
import type { GroupedStation, SelectStationState, Station } from './types';
import { tempStationData } from './temp-data';

export function useSelectStation() {
	const state = $state<SelectStationState>({
		isOpenList: false,
		stations: [],
		groupedStations: {},
		displayedStations: [],
		filteredStations: [],
		keyword: '',
		limit: 30,
		offset: 0,
		loading: false,
		searchTimeout: null,
		triggerRef: null!
	});

	function getSelectedStationDisplay(value: string) {
		let stationObj = state.stations.find((f) => f.stationCode === value);
		if (value === '') {
			return '';
		}
		return stationObj ? `${stationObj.cityName} (${stationObj.stationCode})` : '';
	}

	async function loadStations() {
		let data: Station[] = [];
		const stationLocalStorage = localStorageHelper.getItem<Station[]>(
			localStorageKey.autoComplete.station
		);
		if (stationLocalStorage) {
			data = stationLocalStorage;
		} else {
			data = tempStationData;
			localStorageHelper.setItem(localStorageKey.autoComplete.station, data);
		}
		state.stations = data;

		groupStations();
	}

	function groupStations(): void {
		state.groupedStations = state.stations.reduce(
			(acc: Record<string, GroupedStation>, station: Station) => {
				const { cityCode, isMetropolitan } = station;

				if (!acc[cityCode]) {
					acc[cityCode] = { parent: null, children: [] };
				}

				if (isMetropolitan) {
					acc[cityCode].parent = station;
				} else {
					acc[cityCode].children.push(station);
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

		const filtered = Object.values(state.groupedStations)
			.map(({ parent, children }) => {
				const matchedChildren = children.filter((child) =>
					[child.stationName, child.cityName, child.stationCode].some((field) =>
						field.toLowerCase().includes(searchLower)
					)
				);

				if (
					parent &&
					[parent.stationName, parent.cityName, parent.stationCode].some((field) =>
						field.toLowerCase().includes(searchLower)
					)
				) {
					return { parent, children };
				}

				if (matchedChildren.length > 0) {
					return { parent: null, children: matchedChildren };
				}

				return null;
			})
			.filter(Boolean) as GroupedStation[];

		// Prioritizing exact matches with stationCode
		filtered.sort((a, b) => {
			const aHasExactMatch = a.children.some(
				(child) => child.stationCode.toLowerCase() === searchLower
			);
			const bHasExactMatch = b.children.some(
				(child) => child.stationCode.toLowerCase() === searchLower
			);

			return Number(bHasExactMatch) - Number(aHasExactMatch);
		});

		state.filteredStations = filtered;
		state.displayedStations = [];
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
			state.filteredStations.length > 0
				? state.filteredStations
				: Object.values(state.groupedStations);
		if (state.offset >= source.length) {
			state.loading = false;
			return;
		}

		state.displayedStations = [
			...state.displayedStations,
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
		loadStations();
	});

	return {
		state,
		getSelectedStationDisplay,
		handleScroll,
		resetList,
		handleSearchDebounce
	};
}
