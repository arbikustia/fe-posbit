<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Icon from '@iconify/svelte';

	const projects = [
		{
			title: 'App Redesign for ActiveCoilab',
			description: 'Web and desktop app redesign v6',
			status: 'INPROGRESS',
			time: 'Active Recently',
			icon: 'mdi:palette-outline',
			color: 'blue'
		}
	];

	function filterProjects() {
		console.log('Filtering projects...');
	}
</script>

<div class="">
	<!-- Header -->
	<header class="mb-8">
		<div class="flex items-center justify-between">
			<h1 class="text-2xl font-bold text-gray-900">Audit Schedule</h1>
		</div>

		<div class="mt-6 flex w-full flex-row justify-between gap-4">
			<Button
				onclick={() => goto('/planning/audit-schedule/create')}
				class="flex items-center justify-center rounded-full px-4 py-2"
			>
				<Icon icon="ic:round-plus" width="24" height="24" />
				New Schedule
			</Button>

			<div class="flex w-full flex-row items-center justify-end gap-4">
				<div class="relative">
					<Select.Root type="single">
						<Select.Trigger class="w-fit border-none shadow-none ">Status</Select.Trigger>
						<Select.Content>
							<Select.Item value="light">Light</Select.Item>
							<Select.Item value="dark">Dark</Select.Item>
							<Select.Item value="system">System</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="relative">
					<Select.Root type="single">
						<Select.Trigger class="w-fit border-none shadow-none ">Audit Plan</Select.Trigger>
						<Select.Content>
							<Select.Item value="light">Light</Select.Item>
							<Select.Item value="dark">Dark</Select.Item>
							<Select.Item value="system">System</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="relative">
					<Select.Root type="single">
						<Select.Trigger class="w-fit border-none shadow-none ">Location Audit</Select.Trigger>
						<Select.Content>
							<Select.Item value="light">Light</Select.Item>
							<Select.Item value="dark">Dark</Select.Item>
							<Select.Item value="system">System</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div class="relative">
					<Select.Root type="single">
						<Select.Trigger class="w-fit border-none shadow-none ">Department Audit</Select.Trigger>
						<Select.Content>
							<Select.Item value="light">Light</Select.Item>
							<Select.Item value="dark">Dark</Select.Item>
							<Select.Item value="system">System</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<Icon icon="majesticons:search-line" width="22" height="22" style="color: #737373" />
				<Icon icon="line-md:grid-3-filled" width="22" height="22" style="color: #737373" />
				<Icon icon="ph:list-bold" width="22" height="22" style="color: #737373" />
			</div>
		</div>
	</header>

	<!-- Project List -->
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
		<!-- card -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			onclick={() => goto('/planning/audit-execution')}
			class="card-hover relative flex min-h-44 flex-col justify-between rounded-xl border border-gray-300 bg-white p-5 shadow-lg"
		>
			<div class="h-full">
				<div class="flex justify-between">
					<div>
						<h3 class="mb-1 text-sm font-semibold">App Redesign for ActiveCoilab</h3>
						<p class="mb-4 text-xs font-medium text-gray-500">Category</p>
					</div>
					<div>
						<Icon
							icon="mage:dots"
							class="cursor-pointer"
							width="16"
							height="16"
							style="color: #737373"
						/>
					</div>
				</div>
				<p class="mb-4 text-xs text-gray-600">Web and desktop app redesign v6</p>
			</div>
			<div class="relative bottom-0 flex items-center justify-between text-sm text-gray-500">
				<span class="flex items-center text-xs"> 1 Okt 2025 - 1 Des 2025 </span>
				<div
					class="ONGOING absolute -right-5 flex h-8 w-16 items-center justify-center rounded-l-xl text-xs font-medium"
				>
					ACTIVE
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

	body {
		font-family: 'Inter', sans-serif;
		background-color: #f9fafb;
	}

	.status-badge {
		font-size: 0.75rem;
		font-weight: 500;
		padding: 0.25rem 0.5rem;
		border-radius: 0.375rem;
	}

	.INPROGRESS {
		background-color: #e0f2fe;
		color: #0369a1;
	}

	.RESEARCH {
		background-color: #fef3c7;
		color: #92400e;
	}

	.PROTOTYPING {
		background-color: #ede9fe;
		color: #5b21b6;
	}

	.ONGOING {
		background-color: #dcfce7;
		color: #166534;
	}

	.IDEATE {
		background-color: #ffe4e6;
		color: #9f1239;
	}

	.card-hover {
		transition: all 0.2s ease;
	}

	.card-hover:hover {
		transform: translateY(-2px);
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
</style>
