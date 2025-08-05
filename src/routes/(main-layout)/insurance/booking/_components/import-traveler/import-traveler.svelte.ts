import { type FileDropZoneProps } from '$lib/components/opsigo-ui/file-drop-zone';
import dayjs from 'dayjs';
import { toast } from 'svelte-sonner';
import * as XLSX from 'xlsx';
import type { ImportedTraveler, ImportTravelerState } from './types';

export function useImportTraveler() {
	const state = $state<ImportTravelerState>({
		file: undefined,
		excelData: []
	});

	const onUpload = async (uploadedFiles: File[]) => {
		state.file = uploadedFiles[0];

		readExcel(state.file);
	};
	const onFileRejected: FileDropZoneProps['onFileRejected'] = async ({ reason, file }) => {
		toast.error(`${file.name} failed to upload!`, { description: reason });
	};

	function readExcel(file: File) {
		const reader = new FileReader();

		reader.onload = (e: ProgressEvent<FileReader>) => {
			const arrayBuffer = e.target?.result;
			if (!(arrayBuffer instanceof ArrayBuffer)) return;

			const binaryStr = new Uint8Array(arrayBuffer).reduce(
				(acc, byte) => acc + String.fromCharCode(byte),
				''
			);

			const workbook = XLSX.read(binaryStr, { type: 'binary', cellDates: true });

			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];

			const options = {
				raw: false
			};

			const rawData = XLSX.utils.sheet_to_json(worksheet, options);

			const processedData: ImportedTraveler[] = rawData.map((row: any) => {
				const newRow: Record<string, any> = row;
				for (const key in row) {
					const value = row[key];

					if (dayjs(value).isValid()) {
						newRow[key] = dayjs(value).format('YYYY-MM-DD');
					}
				}
				return {
					title: newRow['Title'],
					firstName: newRow['First Name'],
					lastName: newRow['Last Name'],
					birthDate: newRow['Birth Date'],
					birthPlace: newRow['Birth Place'],
					passportNumber: newRow['Passport Number']
				};
			});

			state.excelData = processedData;
		};

		reader.onerror = (err) => {
			console.error('Error reading file:', err);
		};

		reader.readAsArrayBuffer(file);
	}

	return {
		state,
		onUpload,
		onFileRejected
	};
}
