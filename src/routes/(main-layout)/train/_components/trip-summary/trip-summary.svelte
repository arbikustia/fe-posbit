<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import { displayPassengerDetail } from '$lib/helpers/search-train-helper';
	import { TripRouteInfo } from '../trip-route-info';
	import TripSummaryCompanyHeader from './trip-summary-company-header.svelte';
	import TripSummaryItem from './trip-summary-item.svelte';

	type TripSummaryProps = {
		onChange?: (idx: number) => void;
	};

	let { onChange }: TripSummaryProps = $props();
</script>

<Card.Root class="overflow-hidden py-0">
	<Card.Header class="bg-primary/85 text-primary-foreground py-4 ">
		<TripRouteInfo
			origin="Gambir"
			destination="Bandung"
			originCode="GMR"
			destinationCode="BDG"
			tripType="roundtrip"
		/>

		<div class="text-primary-foreground/70">{displayPassengerDetail({ adult: 2, infant: 1 })}</div>
	</Card.Header>
	<Card.Content class="px-0 pb-4">
		<!-- COMPANY -->
		<div class="mb-6 flex items-center gap-2 px-4">
			<TripSummaryCompanyHeader companyName="RSP (Reka Sinergi Pratama)" />
		</div>

		<div class="space-y-4">
			<TripSummaryItem idx={0} isActive={false} isMultiFlight selected />
			<TripSummaryItem idx={1} isActive={true} isMultiFlight />
		</div>
	</Card.Content>
</Card.Root>
