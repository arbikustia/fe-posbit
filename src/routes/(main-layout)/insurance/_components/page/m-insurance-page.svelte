<script lang="ts">
	import { Insurance } from '$lib/components/icons';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { MSearchFormInsurance } from '../search-form';
	// import { MLastSearch } from '../last-search';
</script>

<div class="">
	<div class="absolute z-20">
		<MOSGAppBar>
			{#snippet leftContent()}
				<div class="flex items-center gap-2">
					<Insurance class="h-6 w-6" />
					<h1 class="text-lg font-semibold">Insurance</h1>
				</div>
			{/snippet}

			{#snippet rightContent()}
				<img class="block h-8 w-auto" src="/images/opsigo-logo.png" alt="Opsigo" />
			{/snippet}
		</MOSGAppBar>
	</div>
	<div class="">
		<img
			class="absolute z-10"
			src="https://tse2.mm.bing.net/th/id/OIP.3ZEOTxYFD82PnEPf7hFYwwHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
			alt=""
		/>
		<div class="absolute z-20 w-screen pt-20">
			<MSearchFormInsurance />
		</div>
	</div>
	<div class="mt-12 space-y-4">
		<!-- <MLastSearch /> -->
	</div>
</div>
