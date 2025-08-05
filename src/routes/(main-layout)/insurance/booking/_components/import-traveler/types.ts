export type ImportedTraveler = {
	title: string;
	firstName: string;
	lastName: string;
	birthDate: string;
	birthPlace: string;
	passportNumber: string;
};

export type ImportTravelerState = {
	file: File | undefined;
	excelData: ImportedTraveler[];
};
