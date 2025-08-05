<script lang="ts">
	import { formatThousand } from '$lib/helpers/number-helper';
	import { cn } from '$lib/utils';

	type PriceDetailItemProps = {
		label: string;
		amount: number;
		currency?: string;
		modifier?: 'none' | 'addition' | 'deduction';
		isTotal?: boolean;
	};

	const {
		label,
		amount,
		currency = 'IDR',
		modifier = 'none',
		isTotal = false
	}: PriceDetailItemProps = $props();

	function getDisplayAmount() {
		let prefix = '';
		if (modifier === 'addition') prefix = '+ ';
		if (modifier === 'deduction') prefix = '- ';

		return `${prefix} ${formatThousand(amount)} ${currency}`;
	}

	function getTextColor() {
		if (modifier === 'addition') {
			return 'text-green-600';
		}

		if (modifier === 'deduction') {
			return 'text-red-600';
		}

		return '';
	}

	let fontWeight = isTotal ? 'font-bold' : 'font-normal';
</script>

<div class="flex items-center justify-between">
	<span class={fontWeight}>{label}</span>
	<span class={cn(getTextColor(), fontWeight)}>{getDisplayAmount()}</span>
</div>
