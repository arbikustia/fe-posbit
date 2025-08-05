export type ProviderList = {
	name: string;
	code: number;
	imageUrl: string;
};

const providerList = [
	{ name: 'Lion', code: 2, imageUrl: 'path/to/lion.png' },
	{ name: 'Sriwijaya', code: 3, imageUrl: 'path/to/sriwijaya.png' },
	{ name: 'Citilink', code: 4, imageUrl: 'path/to/citilink.png' },
	{ name: 'AirAsia', code: 5, imageUrl: 'path/to/airasia.png' },
	{ name: 'Sabre', code: 6, imageUrl: 'path/to/sabre.png' },
	{ name: 'Garuda', code: 7, imageUrl: 'path/to/garuda.png' },
	{ name: 'Jetstar', code: 8, imageUrl: 'path/to/jetstar.png' },
	{ name: 'Kalstar', code: 11, imageUrl: 'path/to/kalstar.png' },
	{ name: 'Scoot', code: 17, imageUrl: 'path/to/scoot.png' },
	{ name: 'Malindo', code: 18, imageUrl: 'path/to/malindo.png' },
	{ name: 'Galileo', code: 22, imageUrl: 'path/to/galileo.png' },
	{ name: 'Amadeus', code: 28, imageUrl: 'path/to/amadeus.png' },
	{ name: 'Singapore Airlines', code: 33, imageUrl: 'path/to/singaporeairlines.png' },
	{ name: 'TransNusa', code: 36, imageUrl: 'path/to/transnusa.png' },
	{ name: 'Emirates', code: 46, imageUrl: 'path/to/emirates.png' },
	{ name: 'Pelita', code: 48, imageUrl: 'path/to/pelita.png' },
	{ name: 'SabreNDC', code: 51, imageUrl: 'path/to/sabrendc.png' }
];

export default providerList;
