<script lang="ts">
	import { Train } from '$lib/components/icons';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { MLastSearch } from '../last-search';
	import { MSearchForm } from '../search-form';
</script>

<div class="">
	<div class="absolute z-20">
		<MOSGAppBar>
			{#snippet leftContent()}
				<div class="flex items-center gap-2">
					<Train class="h-6 w-6" />
					<div class="text-lg font-semibold">Train</div>
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
			src="https://tse1.mm.bing.net/th/id/OIP.AfHjN-kCLN1CBLEeaz4oFAHaEs?rs=1&pid=ImgDetMain&o=7&rm=3"
			alt=""
		/>
		<div class="absolute z-20 w-screen pt-20">
			<MSearchForm />
		</div>
	</div>
	<div class="mt-12 space-y-4">
		<MLastSearch />
	</div>
</div>
