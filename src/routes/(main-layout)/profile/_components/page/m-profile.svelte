<script lang="ts">
	import { page } from '$app/state';
	import { useProfilePage } from './profile.svelte.js';
	import MMyProfile from '../my-profile/m-my-profile.svelte';
	import MSecurityOtp from '../security-otp/m-security-otp.svelte';

	const searchParam = Object.fromEntries(page.url.searchParams);
	const { form } = useProfilePage();
</script>

<main class="h-fit flex-1 bg-gray-50 dark:bg-[#1A1C1E]">
	{#if searchParam.view === 'my-profile'}
		<MMyProfile />
	{:else if searchParam.view === 'security-and-otp'}
		<MSecurityOtp {form} />
	{/if}
</main>
