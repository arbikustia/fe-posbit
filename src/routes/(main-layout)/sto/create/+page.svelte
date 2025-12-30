<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { goto } from '$app/navigation';
	import { BITCard } from '@/components/opsigo-ui/card';
	import { useStoPage } from './use-create.svelte';
	import Icon from '@iconify/svelte';
	import Input from '@/components/ui/input/input.svelte';

	const { handleSubmit, state, generateTimestampCode, getCookie } = useStoPage();
</script>

<form onsubmit={handleSubmit} class="container mx-auto w-full px-4 py-4 sm:px-6 md:px-8">
	<BITCard title="Create New STO">
		<div class="flex w-full flex-col items-center justify-center">
			<div class="flex w-full flex-col gap-3">
				<div class="flex items-center justify-center gap-2">
					<span>Sto Name</span>  <Input
						class="w-72"
						placeholder="STO-{generateTimestampCode()}"
						readonly
					/>
				</div>
				<div class="flex items-center justify-center gap-2">
					<span>Username</span>  <Input
						class="w-72"
						placeholder={getCookie('username')}
						readonly
					/>
				</div>
			</div>
			<!-- <Icon icon="streamline-freehand:code-barcode-scan" width="90" height="94" /> -->
			<!-- <div>This code will automatically generate</div> -->
		</div>

		<div class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
			<Button
				type="button"
				variant="outline"
				class="w-full sm:w-auto"
				disabled={state.isSubmitting}
				onclick={() => goto('/sto')}
			>
				Cancel
			</Button>

			<Button type="submit" class="bg-primary w-full sm:w-auto" disabled={state.isSubmitting}>
				{#if state.isSubmitting}
					<span class="flex items-center gap-2">
						<span
							class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
						></span>
						Saving...
					</span>
				{:else}
					Create STO
				{/if}
			</Button>
		</div>
	</BITCard>
</form>
