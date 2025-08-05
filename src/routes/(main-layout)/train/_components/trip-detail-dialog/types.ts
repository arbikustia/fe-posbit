export type TabKey = 'detail' | 'fare-rules' | 'information';

export type TripDetailDialogProps = {
	isOpen: boolean;
};

export type TabItem = {
	value: TabKey;
	label: string;
};
