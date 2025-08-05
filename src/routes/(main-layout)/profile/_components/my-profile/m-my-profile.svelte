<script lang="ts">
	import { useProfilePage } from '../page/profile.svelte.js';
	import { MOSGAppBar } from '$lib/components/opsigo-ui/m-app-bar';
	import { MEditMyProfile } from './edit-my-profile';
	import { page } from '$app/state';

	let fullName = 'MS NI MADE FELICIA AUDREY WIJAYA';
	let company = 'RSP (Reka Sinergi Pratama)';
	let companyCode = 'COM00001';
	let email = 'emailcontoh@gmail.com';
	let phone = '+62811-123-1234';
	let memberships = [
		{ name: 'Administrator 1', role: 'Admin Finance', open: false },
		{ name: 'Administrator 2', role: 'Admin Ticketing', open: false },
		{ name: 'Administrator 3', role: 'Admin Support', open: false }
	];

	const searchParam = Object.fromEntries(page.url.searchParams);

	const { formEdit } = useProfilePage();

	let isEdit = false;

	function toggleEdit() {
		isEdit = !isEdit;
	}

	function toggleMembership(index: number) {
		memberships = memberships.map((item, i) =>
			i === index ? { ...item, open: !item.open } : item
		);
	}
</script>

<!-- Header -->
{#if !isEdit}
	<!-- Mode View -->
	<MOSGAppBar class="bg-blue-800 text-neutral-50">
		{#snippet leftContent()}
			<div class="text-lg font-semibold w-[80vw] text-neutral-50 text-center">My Profile</div>
		{/snippet}
	</MOSGAppBar>
	<div class="mx-auto mt-5 w-full space-y-6 rounded-lg border bg-white p-6 shadow-xs">
		<div class="flex w-full flex-col items-end justify-between">
			<div></div>
			<button
				on:click={toggleEdit}
				class="flex items-center gap-1 text-sm text-blue-600 hover:underline"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-4 w-4"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M15.232 5.232l3.536 3.536M9 11l6 6M3 21h6l11.707-11.707a1 1 0 000-1.414l-3.586-3.586a1 1 0 00-1.414 0L3 15v6z"
					/>
				</svg>
				Edit Profile
			</button>
			<div class="flex w-full flex-col items-center space-y-2">
				<div class="h-24 w-24 rounded-full bg-gray-300"></div>
				<p class="text-center text-sm font-semibold leading-tight">{fullName}</p>
			</div>
		</div>

		<!-- Info -->
		<div class="space-y-3 border-t pt-4 text-sm">
			<div class="grid grid-cols-1 gap-4">
				<div>
					<p class="text-gray-500">Company</p>
					<p>{company}</p>
					<p class="text-xs text-gray-500">{companyCode}</p>
				</div>
				<div>
					<p class="text-gray-500">Email Address</p>
					<p>{email}</p>
				</div>
				<div>
					<p class="text-gray-500">Mobile Phone</p>
					<div class="flex items-center gap-1">
						<img src="https://flagcdn.com/w40/id.png" alt="Flag" class="h-3 w-5 object-cover" />
						<span>{phone}</span>
					</div>
				</div>
			</div>

			<!-- Membership -->
			<div class="pt-4">
				<p class="mb-2 text-sm font-semibold">Group Membership ({memberships.length})</p>
				<div class="space-y-2">
					{#each memberships as item, i}
						<div class="overflow-hidden rounded border">
							<button
								class="flex w-full items-center justify-between bg-gray-50 px-4 py-2 text-left transition-colors hover:bg-gray-100"
								on:click={() => toggleMembership(i)}
							>
								<span class="font-medium">{item.name}</span>
								<svg
									class="h-4 w-4 transform transition-transform duration-200"
									class:rotate-180={item.open}
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 9l-7 7-7-7"
									/>
								</svg>
							</button>
							{#if item.open}
								<div class="border-t bg-white px-4 py-2 text-sm text-gray-600">
									<div class="flex items-center gap-2">
										<span class="font-medium">Role:</span>
										<span>{item.role}</span>
									</div>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
{:else}
	<!-- Mode Edit -->
	<MEditMyProfile form={formEdit as any} onCancel={toggleEdit} />
{/if}
