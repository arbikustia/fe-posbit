<script>
	import { SearchFormInsurance } from '../../../_components/search-form';
	import { ResultSearch } from '../results-search';
	import { SidebarFilter } from '../sidebar-filter';
</script>

<section>
	<section class="bg-card sticky top-0 z-50 border-y shadow-sm">
		<div class="mx-auto max-w-6xl space-y-1 px-4 pb-2 pt-2">
			<SearchFormInsurance variant={'sticky'} />
		</div>
	</section>
	<div class="container pt-0">
		<div class="flex w-full">
			<div class="w-[30%]">
				<SidebarFilter />
			</div>
			<div class="w-[70%]">
				<ResultSearch />
			</div>
		</div>
	</div>
</section>
