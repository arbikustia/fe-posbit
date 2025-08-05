
export interface SearchInsuranceParam {
 insuranceType: string;
	companyCode: string;
	tripMode: string;
	groupType: string;
	adult: number;
	child: number;
	coverageArea: string;
	originCountry: string;
	destinationCountry: string;
	coverageDate: {
		start: string,
		end: string
	},
	domesticStartDate: string;
	domesticEndDate: string;
	coverageperiod: string;
	coverageStartDate: string;
	coverageEndDate: string;
}