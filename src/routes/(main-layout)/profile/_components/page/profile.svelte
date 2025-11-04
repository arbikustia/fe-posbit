<script lang="ts">
	import MyProfile from '../my-profile/my-profile.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import SecurityOtp from '../security-otp/security-otp.svelte';
	import { useProfilePage } from './profile.svelte.js';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';

	let currentTab = 'my-profile';
	const { form } = useProfilePage();

	const logout: SubmitFunction = () => {
		return async ({ result }) => {
			if (result.type === 'redirect') {
				window.location.href = result.location;
			}
		};
	};
</script>

<div class="container flex h-fit gap-5">
	<!-- Sidebar -->
	<Card.Root class="h-fit w-64">
		<Card.Content>
			<aside>
				<div class="border-b px-3 pb-4 dark:border-gray-600">
					<div class="text-sm font-medium">Admin XX</div>
					<div class="text-xs text-gray-500">admin_opsigxxx@mail.com</div>
					<div class="mt-2 text-sm font-semibold">RSP (Reka Sinergi Pratama)</div>
				</div>
				<nav class="space-y-2 py-4 text-sm">
					<!-- <Button
						variant={currentTab == 'my-profile' ? 'link' : 'ghost'}
						onclick={() => (currentTab = 'my-profile')}
						class={`${currentTab == 'my-profile' ? 'bg-gray-100 font-bold' : ''} block w-full rounded px-3 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-800`}
					>
						My Profile
					</Button> -->
					<Button
						variant={currentTab == 'security' ? 'link' : 'ghost'}
						onclick={() => (currentTab = 'security')}
						class={`${currentTab == 'security' ? 'bg-gray-100 font-bold' : ''} block w-full rounded px-3 py-1 text-left hover:bg-gray-100 dark:hover:bg-gray-800`}
					>
						Security and OTP
					</Button>
					<form method="POST" use:enhance={logout} action="/api/logout">
						<Button
							variant={currentTab == 'logout' ? 'link' : 'ghost'}
							type="submit"
							class="flex w-full items-center justify-start rounded px-3 py-1 font-medium hover:bg-gray-100 focus-visible:outline-hidden"
							>Logout</Button
						>
					</form>
				</nav>
			</aside>
		</Card.Content>
	</Card.Root>
	<!-- Content -->
	<main class="h-fit flex-1 bg-gray-50 dark:bg-[#1A1C1E]">
		{#if currentTab === 'my-profile'}
			<MyProfile />
		{:else if currentTab === 'security'}
			<SecurityOtp {form} />
		{/if}
	</main>
</div>
