<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Home | Bantuit</title>
</svelte:head>

<section>
	<div class="mt-5 space-y-5 px-3">
		<h1 class="font-medium">Hi, Admin XX!</h1>
		<div class="grid grid-cols-4 gap-2">
			<Button
				onclick={() => goto('/flight')}
				variant="ghost"
				class="flex h-20 flex-col items-center justify-center rounded-md border border-neutral-200/50 p-0 shadow-lg"
			>
				<Icon icon="guidance:plane" width="40" height="90" style="color: #5167ff" />
				<p class="text-sm font-medium text-[#5167ff]">Flight</p>
			</Button>
			<Button
				onclick={() => goto('/hotel')}
				variant="ghost"
				class="flex h-20 flex-col items-center justify-center rounded-md border border-neutral-200/50 p-0 shadow-lg"
			>
				<Icon icon="hugeicons:hotel-01" width="40" height="40" style="color: #5167ff" />
				<p class="text-sm font-medium text-[#5167ff]">Hotel</p>
			</Button>

			<Button
				variant="ghost"
				onclick={() => goto('/train')}
				class="flex h-20 flex-col items-center justify-center rounded-md border border-neutral-200/50 p-0 shadow-lg"
			>
				<Icon icon="carbon:train-speed" width="40" height="40" style="color: #5167ff" />
				<p class="text-sm font-medium text-[#5167ff]">Train</p>
			</Button>
			<Button
				onclick={() => goto('/insurance')}
				variant="ghost"
				class="flex h-20 flex-col items-center justify-center rounded-md border border-neutral-200/50 p-0 shadow-lg"
			>
				<Icon icon="stash:shield-duotone" width="40" height="40" style="color: #5167ff" />
				<p class="text-sm font-medium text-[#5167ff]">Insurance</p>
			</Button>
		</div>

		<div class="h-52 w-full rounded-md bg-neutral-400"></div>
		<div class="h-52 w-full rounded-md bg-neutral-400"></div>
	</div>
</section>
