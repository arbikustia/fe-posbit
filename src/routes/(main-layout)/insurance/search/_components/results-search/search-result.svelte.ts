import { writable, derived } from 'svelte/store';
import { insurancePlans } from './insurance-data';

// Types
type ViewType = 'card' | 'table';
export type SortOption = 'Price Low to High' | 'Price High to Low' | 'Default';

interface Provider {
  id: string;
  name: string;
  checked: boolean;
}

interface AreaCoverage {
  id: string;
  name: string;
  checked: boolean;
}

interface FilterState {
  providers: Provider[];
  ageRange: [number, number];
  areaCoverage: AreaCoverage[];
  priceRange: [number, number];
}

// State stores
export const currentView = writable<ViewType>('card');
export const sortOption = writable<SortOption>('Price Low to High');
export const expandedCard = writable<number | null>(null);

// Filter state
export const filterState = writable<FilterState>({
  providers: [
    { id: 'zurich', name: 'Zurich', checked: true },
    { id: 'sompo', name: 'Sompo', checked: true },
    { id: 'mega', name: 'Mega', checked: true },
    { id: 'tokio-marine', name: 'Tokio Marine', checked: true },
    { id: 'sahabat', name: 'Sahabat', checked: true },
    { id: 'allianz', name: 'Allianz', checked: true },
    { id: 'aig', name: 'AIG', checked: true },
    { id: 'chubb', name: 'Chubb', checked: true },
    { id: 'axa', name: 'AXA', checked: true },
    { id: 'manulife', name: 'Manulife', checked: true }
  ],
  ageRange: [1, 65],
  areaCoverage: [
    { id: 'worldwide', name: 'Worldwide', checked: true },
    { id: 'usa', name: 'USA', checked: true },
    { id: 'canada', name: 'Canada', checked: true }
  ],
  priceRange: [0, 300000]
});

// Derived store for filtered plans
export const filteredPlans = derived(
  [filterState],
  ([$filterState]) => {
    return insurancePlans.filter(plan => {
      // Filter by provider (unchanged)
      const selectedProviders = $filterState.providers
        .filter(p => p.checked)
        .map(p => p.name.toLowerCase());
      
      if (selectedProviders.length > 0) {
        const planProvider = plan.provider.toLowerCase();
        if (!selectedProviders.includes(planProvider)) return false;
      }

      // Filter by age range (simplified)
      const [minAge, maxAge] = $filterState.ageRange;
      const [planMinAge, planMaxAge] = plan.ageRange;
      
      if (planMinAge > maxAge || planMaxAge < minAge) return false;

      // Filter by area coverage (updated logic)
      const selectedWorldwide = $filterState.areaCoverage.find(a => a.id === 'worldwide')?.checked;
      const selectedUSA = $filterState.areaCoverage.find(a => a.id === 'usa')?.checked;
      const selectedCanada = $filterState.areaCoverage.find(a => a.id === 'canada')?.checked;

      // Check if any coverage filters are active
      const hasCoverageFilters = selectedWorldwide || selectedUSA || selectedCanada;
      
      if (hasCoverageFilters) {
        // Get plan's coverage settings
        const planWorldwide = plan.coverage.some(c => c.id === 'worldwide' && c.checked);
        const planUSA = plan.coverage.some(c => c.id === 'usa' && c.checked);
        const planCanada = plan.coverage.some(c => c.id === 'canada' && c.checked);

        // Worldwide filter is special - if selected, plan must have worldwide coverage
        if (selectedWorldwide && !planWorldwide) return false;
        
        // If USA is selected, plan must cover USA
        if (selectedUSA && !planUSA) return false;
        
        // If Canada is selected, plan must cover Canada
        if (selectedCanada && !planCanada) return false;
      }

      // Filter by price range (unchanged)
      const [minPrice, maxPrice] = $filterState.priceRange;
      if (plan.price < minPrice || plan.price > maxPrice) return false;

      return true;
    });
  }
);

// Final sorted plans (combines filtering and sorting)
export const sortedPlans = derived(
  [filteredPlans, sortOption],
  ([$filteredPlans, $sortOption]) => {
    let plans = [...$filteredPlans];
    
    if ($sortOption === 'Price Low to High') {
      plans = plans.sort((a, b) => a.price - b.price);
    } else if ($sortOption === 'Price High to Low') {
      plans = plans.sort((a, b) => b.price - a.price);
    }
    
    return plans;
  }
);

// Share hotels data (unchanged)
export const sharehotels = [
  {
    id: 1,
    name: 'Srivijaya Hotel',
    starRating: 3,
    address: 'Jalan Veteran No. 1, Gambir, Jakarta Pusat 10110',
    price: 375000
  },
  {
    id: 2,
    name: 'Hotel Borobudur',
    starRating: 5,
    address: 'Jl. Lapangan Banteng Selatan No. 1, Pasar Baru, Sawah Besar 10710',
    price: 1025000
  }
];

// Actions (unchanged)
export function handleSortChange(value: SortOption) {
  sortOption.set(value);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID').format(price);
}

export function selectPlan(planId: number) {
  console.log(`Selected plan: ${planId}`);
}

export function showMoreDetails(planId: number) {
  console.log(`Show more details for plan: ${planId}`);
}

export function toggleCard(planId: number) {
  expandedCard.update(current => current === planId ? null : planId);
}

export function setView(view: ViewType) {
  currentView.set(view);
}

// Filter actions (unchanged)
export function updateProviderFilter(providerId: string, checked: boolean) {
  filterState.update(state => ({
    ...state,
    providers: state.providers.map(p => 
      p.id === providerId ? { ...p, checked } : p
    )
  }));
}

export function updateAgeRangeFilter(ageRange: [number, number]) {
  filterState.update(state => ({
    ...state,
    ageRange
  }));
}

export function updateAreaCoverageFilter(areaId: string, checked: boolean) {
  filterState.update(state => ({
    ...state,
    areaCoverage: state.areaCoverage.map(a => 
      a.id === areaId ? { ...a, checked } : a
    )
  }));
}

export function updatePriceRangeFilter(priceRange: [number, number]) {
  filterState.update(state => ({
    ...state,
    priceRange
  }));
}

// Reset functions (unchanged)
export function resetProviders() {
  filterState.update(state => ({
    ...state,
    providers: state.providers.map(p => ({ ...p, checked: false }))
  }));
}

export function resetAgeRange() {
  filterState.update(state => ({
    ...state,
    ageRange: [1, 85]
  }));
}

export function resetAreaCoverage() {
  filterState.update(state => ({
    ...state,
    areaCoverage: state.areaCoverage.map(a => ({ ...a, checked: false }))
  }));
}

export function resetPriceRange() {
  filterState.update(state => ({
    ...state,
    priceRange: [0, 300000]
  }));
}

export function resetAllFilters() {
  filterState.update(state => ({
    providers: state.providers.map(p => ({ ...p, checked: false })),
    ageRange: [1, 85],
    areaCoverage: state.areaCoverage.map(a => ({ ...a, checked: false })),
    priceRange: [0, 300000]
  }));
}

// Utility functions (updated to match new filter structure)
export function getActiveFiltersCount() {
  return derived(filterState, ($filterState) => {
    let count = 0;
    
    // Count active providers
    const activeProviders = $filterState.providers.filter(p => p.checked).length;
    if (activeProviders > 0 && activeProviders < $filterState.providers.length) {
      count++;
    }
    
    // Count age range filter
    if ($filterState.ageRange[0] !== 1 || $filterState.ageRange[1] !== 85) {
      count++;
    }
    
    // Count active area coverage
    const activeAreas = $filterState.areaCoverage.filter(a => a.checked).length;
    if (activeAreas > 0 && activeAreas < $filterState.areaCoverage.length) {
      count++;
    }
    
    // Count price range filter
    if ($filterState.priceRange[0] !== 0 || $filterState.priceRange[1] !== 300000) {
      count++;
    }
    
    return count;
  });
}