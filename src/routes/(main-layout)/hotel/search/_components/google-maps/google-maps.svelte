<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import marks from './marks.json';
	import { goto } from '$app/navigation';

	interface Hotel {
		id: number;
		name: string;
		lat: number;
		lng: number;
		image?: string;
		rating?: number;
		price?: string;
		originalPrice?: string;
		badge?: string;
	}

	type GoogleMap = google.maps.Map;
	type AdvancedMarker = google.maps.marker.AdvancedMarkerElement;
	type PinElement = google.maps.marker.PinElement;

	const hotels: Hotel[] = marks.hotels_marks;

	let map: GoogleMap | null = null;
	let markers: AdvancedMarker[] = [];
	let currentHoverCard: HTMLElement | null = null;
	let activeMarker: HTMLElement | null = null;
	const apiKey: string = 'AIzaSyA87ifASVy8ZeqhykhXhTGGQOnpHIsWkaI';
	let mapError: string | null = null;

	onDestroy(cleanupMap);
	function cleanupMap(): void {
		if (currentHoverCard) {
			currentHoverCard.remove();
			currentHoverCard = null;
		}
		markers.forEach((marker) => (marker.map = null));
		markers = [];
		map = null;
		activeMarker = null;

		const container = document.getElementById('map');
		if (container) container.innerHTML = '';
	}

	function createHoverCard(hotel: Hotel): HTMLElement {
		const cardElement = document.createElement('div');
		cardElement.className = 'hotel-hover-card';
		cardElement.innerHTML = `
			<div class="bg-white rounded-lg shadow-lg overflow-hidden w-72 cursor-pointer hover:shadow-xl transition-shadow duration-200">
				<!-- Hotel Image -->
				<div class="relative h-32 bg-gray-200">
					${
						hotel.image
							? `<img src="${hotel.image}" alt="${hotel.name}" class="w-full h-full object-cover">`
							: `<div class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
							<span class="text-white text-lg font-semibold">${hotel.name.charAt(0)}</span>
						</div>`
					}
					${hotel.badge ? `<div class="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">${hotel.badge}</div>` : ''}
				</div>
				
				<!-- Hotel Info -->
				<div class="p-3">
					<h3 class="font-bold text-gray-800 text-sm mb-1 truncate">${hotel.name}</h3>
					
					<!-- Rating -->
					<div class="flex items-center mb-2">
						${Array.from(
							{ length: 5 },
							(_, i) =>
								`<svg class="w-3 h-3 ${i < (hotel.rating || 4) ? 'text-yellow-400' : 'text-gray-300'}" fill="currentColor" viewBox="0 0 20 20">
								<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
							</svg>`
						).join('')}
						<span class="ml-1 text-xs text-blue-600 font-medium">Very Good - ${hotel.rating || 8.7}</span>
					</div>
					
					<!-- Price -->
					<div class="flex items-center justify-between">
						<div>
							${hotel.originalPrice ? `<span class="text-xs text-gray-500 line-through">${hotel.originalPrice}</span>` : ''}
							<div class="text-orange-600 font-bold text-sm">${hotel.price || 'Rp 3.795.784'}</div>
						</div>
					      <button class="see-rooms-btn bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors">
            See Rooms
        </button>
					</div>
				</div>
				
				<!-- Pointer -->
				<div class="absolute -bottom-2 left-[155px] transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
			</div>
		`;

		const button = cardElement.querySelector('.see-rooms-btn');
		if (button) {
			button.addEventListener('click', (e) => {
				e.stopPropagation();
				goto(`/hotel/detail`); // Tambahkan ID hotel di URL
			});
		}

		// Prevent card from closing when clicking on it
		cardElement.addEventListener('click', (e) => {
			e.stopPropagation();
		});

		return cardElement;
	}

	function showHoverCard(hotel: Hotel, markerElement: HTMLElement): void {
		// Remove existing hover card
		if (currentHoverCard) {
			currentHoverCard.remove();
			currentHoverCard = null;
		}

		// Reset previous active marker style
		if (activeMarker) {
			const innerDiv = activeMarker.querySelector('div');
			if (innerDiv) {
				innerDiv.className = innerDiv.className.replace(' ring-4 ring-blue-400 ring-opacity-50', '');
			}
		}

		// Set new active marker style
		const innerDiv = markerElement.querySelector('div');
		if (innerDiv) {
			innerDiv.className += ' ring-4 ring-blue-400 ring-opacity-50';
		}
		activeMarker = markerElement;

		// Create new hover card
		const hoverCard = createHoverCard(hotel);

		// Position the card above the marker
		const markerRect = markerElement.getBoundingClientRect();
		const mapContainer = document.getElementById('map');
		if (!mapContainer) return;

		const mapRect = mapContainer.getBoundingClientRect();

		// Calculate position relative to map container
		const left = markerRect.left - mapRect.left - 144; // 144px is half of card width (288px/2)
		const top = markerRect.top - mapRect.top - 210; // Position above marker with some padding

		hoverCard.style.position = 'absolute';
		hoverCard.style.left = `${left}px`;
		hoverCard.style.top = `${top}px`;
		hoverCard.style.zIndex = '1000';
		hoverCard.style.pointerEvents = 'auto';

		mapContainer.appendChild(hoverCard);
		currentHoverCard = hoverCard;
	}

	function hideHoverCard(): void {
		if (currentHoverCard) {
			currentHoverCard.remove();
			currentHoverCard = null;
		}
		
		// Reset active marker style
		if (activeMarker) {
			const innerDiv = activeMarker.querySelector('div');
			if (innerDiv) {
				innerDiv.className = innerDiv.className.replace(' ring-4 ring-blue-400 ring-opacity-50', '');
			}
			activeMarker = null;
		}
	}

	function createRedMarker(): HTMLElement {
		const markerElement = document.createElement('div');
		markerElement.innerHTML = `
			<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white shadow-lg relative cursor-pointer transform transition-all duration-200 hover:scale-110">
				<div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
			</div>
		`;
		return markerElement;
	}

	function loadGoogleMaps(): Promise<void> {
		return new Promise((resolve, reject) => {
			if (window.google?.maps) {
				resolve();
				return;
			}

			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=marker&callback=initMap`;
			script.async = true;
			script.defer = true;
			document.head.appendChild(script);

			window.initMap = () => resolve();
			script.onerror = () => reject(new Error('Failed to load Google Maps script'));
		});
	}

	onMount(async () => {
		try {
			await loadGoogleMaps();

			const mapContainer = document.getElementById('map');
			if (!mapContainer) throw new Error('Map container not found');

			const { Map } = google.maps;
			const { AdvancedMarkerElement } = google.maps.marker;

			map = new Map(mapContainer, {
				center: { lat: -6.2088, lng: 106.8456 },
				zoom: 12,
				disableDefaultUI: true,
				mapId: 'DEMO_MAP_ID' // Required for Advanced Markers
			});

			// Create markers for each hotel
			markers = hotels.map((hotel) => {
				const markerContent = createRedMarker();

				const marker = new AdvancedMarkerElement({
					map,
					position: { lat: hotel.lat, lng: hotel.lng },
					content: markerContent,
					title: '' // Disable default tooltip
				});

				// Add click event to show/hide tooltip
				markerContent.addEventListener('click', (e) => {
					e.stopPropagation();
					
					// If clicking the same marker, hide the tooltip
					if (activeMarker === markerContent) {
						hideHoverCard();
					} else {
						// Show tooltip for this marker
						showHoverCard(hotel, markerContent);
					}
				});

				return marker;
			});

			// Hide hover card when clicking on map (but not on markers)
			map.addListener('click', () => {
				hideHoverCard();
			});

			// Hide hover card when map is dragged/moved
			map.addListener('dragstart', () => {
				hideHoverCard();
			});

			// Hide hover card when map is zoomed
			map.addListener('zoom_changed', () => {
				hideHoverCard();
			});

			// Hide hover card when clicking outside the map
			document.addEventListener('click', (e) => {
				const mapContainer = document.getElementById('map');
				if (mapContainer && !mapContainer.contains(e.target as Node)) {
					hideHoverCard();
				}
			});

			mapError = null;
		} catch (err) {
			console.error(err);
			mapError = err instanceof Error ? err.message : 'Map failed to load';
		}
	});

	// Declare initMap for Google callback
	declare global {
		interface Window {
			initMap: () => void;
		}
	}
</script>

<!-- Tailwind Styling -->
<div class="h-full w-full overflow-hidden rounded-none shadow-md">
	{#if mapError}
		<div
			class="flex h-full w-full flex-col items-center justify-center bg-red-100 text-sm text-red-700"
		>
			<p>{mapError}</p>
			<button
				class="mt-2 rounded border border-red-700 px-4 py-1 hover:bg-red-200"
				on:click={() => location.reload()}
			>
				Refresh Page
			</button>
		</div>
	{:else}
		<div id="map" class="relative h-full w-full"></div>
	{/if}
</div>

<style>
	:global(.hotel-hover-card) {
		animation: fadeInScale 0.2s ease-out;
	}

	:global(.hotel-hover-card:hover) {
		z-index: 1001 !important;
	}

	@keyframes fadeInScale {
		from {
			opacity: 0;
			transform: scale(0.8);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}
</style>